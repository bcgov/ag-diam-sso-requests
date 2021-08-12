import { Op } from 'sequelize';
import { sequelize, models } from '../../../shared/sequelize/models/models';
import { Session, Data } from '../../../shared/interfaces';
import { kebabCase, omit } from 'lodash';
import { validateRequest } from '../utils/helpers';
import { dispatchRequestWorkflow } from '../github';

const NEW_REQUEST_DAY_LIMIT = 10;

const errorResponse = (err: any) => {
  console.error(err);
  return {
    statusCode: 422,
    body: JSON.stringify(err.message || err),
  };
};

const unauthorized = () => {
  return {
    statusCode: 401,
    body: JSON.stringify('unauthorized request'),
  };
};

export const createRequest = async (session: Session, data: Data) => {
  const [hasError, errorMessage] = await hasRequestWithFailedApplyStatus();
  if (hasError) return errorResponse(errorMessage);

  try {
    const now = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const numOfRequestsForToday = await models.request.count({
      where: {
        idirUserid: session.idir_userid,
        createdAt: {
          [Op.gt]: oneDayAgo,
          [Op.lt]: now,
        },
      },
    });

    if (numOfRequestsForToday >= NEW_REQUEST_DAY_LIMIT) {
      throw Error('reached the day limit');
    }

    const { projectName, projectLead, preferredEmail, newToSso, publicAccess } = data;
    const result = await models.request.create({
      idirUserid: session.idir_userid,
      projectName,
      projectLead,
      preferredEmail,
      newToSso,
      publicAccess,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...result.dataValues, numOfRequestsForToday }),
    };
  } catch (err) {
    return errorResponse(err);
  }
};

export const updateRequest = async (session: Session, data: Data, submit: string | undefined) => {
  const [hasError, errorMessage] = await hasRequestWithFailedApplyStatus();
  if (hasError) return errorResponse(errorMessage);

  try {
    const { id, ...rest } = data;
    const original = await models.request.findOne({
      where: {
        idirUserid: session.idir_userid,
        id,
      },
    });

    if (!original) {
      return unauthorized();
    }

    if (!['draft', 'applied'].includes(original.dataValues.status)) {
      return unauthorized();
    }

    const immutableFields = ['idirUserid', 'projectLead', 'clientName', 'status'];
    const allowedRequest = omit(rest, immutableFields);
    const mergedRequest = { ...original.dataValues, ...allowedRequest };

    if (submit) {
      const isValid = validateRequest(mergedRequest);
      if (isValid !== true) return errorResponse({ ...isValid, prepared: mergedRequest });
      allowedRequest.clientName = `${kebabCase(allowedRequest.projectName)}-${id}`;
      allowedRequest.status = 'submitted';

      // trigger GitHub workflow before updating the record
      const payload = {
        requestId: mergedRequest.id,
        clientName: allowedRequest.clientName,
        realmName: mergedRequest.realm,
        validRedirectUris: {
          dev: mergedRequest.devValidRedirectUris,
          test: mergedRequest.testValidRedirectUris,
          prod: mergedRequest.prodValidRedirectUris,
        },
        environments: mergedRequest.environments,
        publicAccess: mergedRequest.publicAccess,
      };

      const ghResult = await dispatchRequestWorkflow(payload);
      console.log(JSON.stringify(ghResult));

      if (ghResult.status !== 204) {
        return errorResponse('failed to create a workflow dispatch event');
      }
    }

    allowedRequest.updatedAt = sequelize.literal('CURRENT_TIMESTAMP');

    const result = await models.request.update(allowedRequest, {
      where: { id },
      returning: true,
      plain: true,
    });

    if (result.length < 2) {
      return errorResponse('update failed');
    }

    const updatedRequest = result[1].dataValues;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedRequest),
    };
  } catch (err) {
    return errorResponse(err);
  }
};

export const getRequest = async (session: Session, data: { requestId: number }) => {
  try {
    const request = await models.request.findOne({
      where: {
        idirUserid: session.idir_userid,
        id: data.requestId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(request),
    };
  } catch (err) {
    return errorResponse(err);
  }
};

export const getRequests = async (session: Session) => {
  try {
    const requests = await models.request.findAll({
      where: {
        idirUserid: session.idir_userid,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(requests),
    };
  } catch (err) {
    return errorResponse(err);
  }
};

const hasRequestWithFailedApplyStatus = async () => {
  try {
    const applyFailedRequests = await models.request.findAll({
      where: {
        status: 'applyFailed',
      },
    });

    if (applyFailedRequests.length > 0) return [true, 'A request exists in the apply-failed status'];
    return [false, null];
  } catch (err) {
    return [true, err];
  }
};
