import React, { useState, useEffect } from 'react';
import FormHeader from 'form-components/FormHeader';
import FormStage from 'form-components/FormStage';
import Form from 'form-components/GovForm';
import getUiSchema from 'schemas/ui';
import FormButtons from 'form-components/FormButtons';
import { Request } from 'interfaces/Request';
import CenteredModal from 'components/CenteredModal';
import Button from '@button-inc/bcgov-theme/Button';
import { createRequest, updateRequest } from 'services/request';
import ArrayFieldTemplate from 'form-components/ArrayFieldTemplate';
import FormReview from 'form-components/FormReview';
import TermsAndConditions from 'components/TermsAndConditions';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { nonBceidSchemas, adminNonBceidSchemas } from 'schemas/non-bceid-schemas';
import { validateForm } from 'utils/helpers';
import { bceidStages, adminBceidStages, stageTitlesUsingForms, stageTitlesReviewing } from 'utils/constants';
import { customValidate } from 'utils/shared/customValidate';
import { withBottomAlert, BottomAlert } from 'layout/BottomAlert';
import { SaveMessage } from 'interfaces/form';
import Link from '@button-inc/bcgov-theme/Link';

const Description = styled.p`
  margin: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
`;

interface Props {
  currentUser: {
    email?: string;
  };
  request?: any;
  alert: BottomAlert;
  isAdmin: boolean;
}

function FormTemplate({ currentUser = {}, request, alert, isAdmin }: Props) {
  const [formData, setFormData] = useState((request || {}) as Request);
  const [formStage, setFormStage] = useState(request ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [visited, setVisited] = useState<any>(request ? { '0': true } : {});
  const router = useRouter();
  const schemas = isAdmin ? adminNonBceidSchemas : nonBceidSchemas;
  const stages = isAdmin ? adminBceidStages : bceidStages;
  const stageTitle = stages.find((stage) => stage.number === formStage)?.title || '';

  const handleChange = (e: any) => {
    setFormData(e.formData);
    if (e.formData.projectLead === false) {
      window.location.hash = 'info-modal';
    }
  };

  useEffect(() => {
    if (!formData.preferredEmail) {
      setFormData({ ...formData, preferredEmail: currentUser.email || '' });
    }
  }, [currentUser]);

  const changeStep = (newStage: number) => {
    visited[formStage] = true;

    if (newStage === 3) {
      visited['0'] = true;
      visited['1'] = true;
      visited['2'] = true;
    }

    const formErrors = validateForm(formData, schemas, visited);
    setErrors(formErrors);
    setFormStage(newStage);
    setVisited(visited);
    alert.hide();
  };

  const handleBackClick = () => {
    const redirectUrl = isAdmin ? '/admin-dashboard' : '/my-requests';
    router.push({ pathname: redirectUrl });
  };

  const creatingNewForm = () => router.route.endsWith('/request');

  const uiSchema = getUiSchema(!creatingNewForm());

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      if (creatingNewForm()) {
        const [data, err] = await createRequest(formData);
        const { id } = data || {};

        if (err || !id) {
          setLoading(false);
          return;
        }
        const redirectUrl = isAdmin ? '/admin-dashboard' : `/request/${id}`;
        await router.push({ pathname: redirectUrl });
        setFormData({ ...formData, id });
      } else {
        await updateRequest(formData);
        handleButtonSubmit();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleButtonSubmit = async () => {
    if (formStage === 0) {
      if (creatingNewForm()) {
        visited[formStage] = true;
        setVisited(visited);
        return;
      }
    }

    const newStage = formStage + 1;
    changeStep(newStage);
  };

  const handleBlur = async (id: string, value: any) => {
    if (creatingNewForm() || isAdmin) return;
    if (request) {
      setSaving(true);
      const [, err] = await updateRequest({ ...formData, id: request.id });
      if (!err) setSaveMessage({ content: `Last saved at ${new Date().toLocaleString()}`, error: false });
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    window.location.hash = '#';
  };

  const backButtonText = request ? 'Save and Close' : 'Cancel';

  return (
    <>
      <HeaderContainer>
        <FormHeader formStage={formStage} id={formData.id} />
        <FormStage
          currentStage={formStage}
          setFormStage={changeStep}
          errors={errors}
          creatingNewForm={creatingNewForm}
          visited={visited}
          stages={stages}
        />
        <Description>
          If new to SSO, please visit{' '}
          <Link external href="https://github.com/bcgov/ocp-sso/wiki/Using-Your-SSO-Client">
            github
          </Link>{' '}
          for more information.
        </Description>
      </HeaderContainer>
      {stageTitle === 'Terms and conditions' && <TermsAndConditions />}
      {stageTitlesReviewing.includes(stageTitle) && (
        <FormReview
          formData={formData}
          setErrors={setErrors}
          errors={errors}
          visited={visited}
          saving={saving}
          saveMessage={saveMessage}
          isAdmin={isAdmin}
          setFormData={setFormData}
        />
      )}
      {stageTitlesUsingForms.includes(stageTitle) && (
        <Form
          schema={schemas[formStage] || {}}
          uiSchema={uiSchema}
          onChange={handleChange}
          onSubmit={handleFormSubmit}
          formData={formData}
          ArrayFieldTemplate={ArrayFieldTemplate}
          onBlur={handleBlur}
          liveValidate={visited[formStage] || isAdmin}
          validate={customValidate}
        >
          <FormButtons
            formSubmission={formStage === 0}
            text={{ continue: 'Next', back: backButtonText }}
            show={!isAdmin && (formStage !== 0 || formData.projectLead)}
            loading={loading}
            handleSubmit={handleButtonSubmit}
            handleBackClick={handleBackClick}
            saving={saving}
            saveMessage={saveMessage}
          />
        </Form>
      )}
      {stageTitle === 'Requester Info' && (
        <CenteredModal
          id="info-modal"
          content={
            <>
              <p>If you are not accountable for this project, please refer this request to someone who is.</p>
              <p> Only the person who is responsible for this project can submit the intergration request.</p>
            </>
          }
          icon={faInfoCircle}
          onConfirm={handleModalClose}
          confirmText="Okay"
          showCancel={false}
        />
      )}
    </>
  );
}

export default withBottomAlert(FormTemplate);
