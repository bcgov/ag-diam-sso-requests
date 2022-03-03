import { models } from '../../../shared/sequelize/models/models';
import { mergePR } from '../github';
import { sendEmail } from '../../../shared/utils/ches';
import { getEmailList } from '../../../shared/utils/helpers';
import { renderTemplate } from '../../../shared/templates';
import { EVENTS } from '../../../shared/enums';

const createEvent = async (data) => {
  try {
    await models.event.create(data);
  } catch (err) {
    console.error(err);
  }
};

export default async function updateStatus(event) {
  const { body, queryStringParameters } = event;
  const {
    prNumber,
    prSuccess,
    planSuccess,
    applySuccess,
    id,
    actionNumber,
    planDetails,
    repoOwner,
    repoName,
    isAllowedToMerge,
  } = JSON.parse(body);
  const { status: githubActionsStage } = queryStringParameters || {};

  // empty PR
  if (githubActionsStage === 'empty') {
    await models.request.update({ prNumber, status: 'applied', actionNumber }, { where: { id } });
  }
  // PR created
  else if (githubActionsStage === 'create') {
    const success = String(prSuccess) === 'true';
    const requestStatus = success ? 'pr' : 'prFailed';
    await Promise.all([
      models.request.update({ prNumber, status: requestStatus, actionNumber }, { where: { id } }),
      createEvent({ eventCode: success ? EVENTS.REQUEST_PR_SUCCESS : EVENTS.REQUEST_PR_FAILURE, requestId: id }),
    ]);
  } else {
    // After creation, gh action only has prNumber to reference request. Using this to grab the requestId first
    const request = await models.request.findOne({ where: { prNumber } });
    if (!request) throw Error(`request associated with pr number ${prNumber} not found`);

    const { id: requestId, status: currentStatus } = request;

    // TF plan stage
    if (githubActionsStage === 'plan') {
      const isAlreadyApplied = currentStatus === 'applied';
      const success = String(planSuccess) === 'true';
      const planStatus = success ? 'planned' : 'planFailed';
      await Promise.all([
        !isAlreadyApplied && models.request.update({ status: planStatus }, { where: { id: requestId } }),
        createEvent({
          eventCode: success ? EVENTS.REQUEST_PLAN_SUCCESS : EVENTS.REQUEST_PLAN_FAILURE,
          requestId,
          details: { planDetails },
        }),
      ]);

      if (isAllowedToMerge) await mergePR({ owner: repoOwner, repo: repoName, prNumber });
    }
    // TF apply stage
    else if (githubActionsStage === 'apply') {
      const isUpdate = !!(await models.event.findOne({
        where: { eventCode: EVENTS.REQUEST_APPLY_SUCCESS, requestId },
      }));

      const success = String(applySuccess) === 'true';
      const applyStatus = success ? 'applied' : 'applyFailed';

      await Promise.all([
        models.request.update({ status: applyStatus, hasUnreadNotifications: isUpdate }, { where: { id: requestId } }),
        createEvent({ eventCode: success ? EVENTS.REQUEST_APPLY_SUCCESS : EVENTS.REQUEST_APPLY_FAILURE, requestId }),
      ]);

      if (success && !request.archived) {
        const emailCode = isUpdate ? 'uri-change-request-approved' : 'create-request-approved';
        const to = await getEmailList(request);

        await sendEmail({
          to,
          ...renderTemplate(emailCode, { request }),
          event: { emailCode, requestId },
        });
      }
    }
  }

  return {};
}
