import styled from 'styled-components';
import Tab from 'react-bootstrap/Tab';
import Alert from 'html-components/Alert';
import InstallationPanel from 'components/InstallationPanel';
import SecretsPanel from 'page-partials/my-dashboard/SecretsPanel';
import { getStatusDisplayName } from 'utils/status';
import SubmittedStatusIndicator from 'components/SubmittedStatusIndicator';
import UserEventPanel from 'components/UserEventPanel';
import { RequestTabs } from 'components/RequestTabs';
import { usesBceid } from 'utils/helpers';
import { NumberedContents } from '@bcgov-sso/common-react-components';
import BceidStatus from 'components/BceidStatus';
import DefaultTitle from 'components/SHeader3';
import { useContext } from 'react';
import { RequestsContext } from 'pages/my-dashboard';
import { $setPanelTab } from 'dispatchers/requestDispatcher';

const Title = styled(DefaultTitle)`
  margin-top: 10px;
`;

const TabWrapper = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
`;

export type TabKey = 'installation-json' | 'configuration-url' | 'history';

function RequestInfoTabs() {
  const { state, dispatch } = useContext(RequestsContext);
  const { requests, activeRequestId, panelTab } = state;
  const selectedRequest = requests?.find((request) => request.id === activeRequestId);
  if (!selectedRequest) return null;

  const { status, bceidApproved } = selectedRequest;
  const displayStatus = getStatusDisplayName(status || 'draft');
  const awaitingBceidProd = usesBceid(selectedRequest?.realm) && selectedRequest.prod && !bceidApproved;
  let panel = null;

  if (displayStatus === 'In Draft') {
    panel = (
      <>
        <br />
        <Alert variant="info">
          <div>
            <strong>Your request has not been submitted.</strong>
          </div>
          <div>To complete your request, click &quot;Edit&quot; button.</div>
        </Alert>
      </>
    );
  } else if (displayStatus === 'Submitted') {
    panel = (
      <RequestTabs activeKey="Integration-request-summary">
        <Tab eventKey="Integration-request-summary" title="Integration Request Summary">
          <TabWrapper>
            {awaitingBceidProd ? (
              <>
                <NumberedContents
                  number={1}
                  title="Access to Dev and/or Test environment(s) - approx 20 mins"
                  variant="secondary"
                >
                  <SubmittedStatusIndicator selectedRequest={selectedRequest} />
                  <br />
                </NumberedContents>
                <NumberedContents number={2} title="Access to Prod environment - (TBD)" variant="secondary">
                  <BceidStatus request={selectedRequest} />
                </NumberedContents>
              </>
            ) : (
              <SubmittedStatusIndicator
                selectedRequest={selectedRequest}
                title="Access to environment(s) - approx 20 mins"
              />
            )}
          </TabWrapper>
        </Tab>
      </RequestTabs>
    );
  } else if (displayStatus === 'Completed') {
    panel = (
      <>
        <RequestTabs activeKey={panelTab} onSelect={(k: TabKey) => dispatch($setPanelTab(k))}>
          <Tab eventKey="installation-json" title="Installation JSON">
            <TabWrapper>
              <InstallationPanel selectedRequest={selectedRequest} />
            </TabWrapper>
          </Tab>
          {!selectedRequest.publicAccess && (
            <Tab eventKey="configuration-url" title="Secrets">
              <TabWrapper>
                <SecretsPanel selectedRequest={selectedRequest} />
              </TabWrapper>
            </Tab>
          )}
          <Tab eventKey="history" title="History">
            <TabWrapper>
              <UserEventPanel requestId={selectedRequest.id} />
            </TabWrapper>
          </Tab>
        </RequestTabs>
        {awaitingBceidProd && (
          <>
            <Title>Production Status</Title>
            <BceidStatus request={selectedRequest} />
          </>
        )}
      </>
    );
  }

  return panel;
}

export default RequestInfoTabs;