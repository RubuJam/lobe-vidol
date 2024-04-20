import classNames from 'classnames';
import React, { memo, useEffect } from 'react';

import GridList from '@/components/GridList';
import { agentListSelectors, useAgentStore } from '@/store/agent';
import { useMarketStore } from '@/store/market';

import { useStyles } from './style';

interface AgentListProps {
  className?: string;
  style?: React.CSSProperties;
}

const AgentList = (props: AgentListProps) => {
  const { className, style } = props;
  const [activateAgent, agentList, agentLoading, currentAgentId, fetchAgentIndex] = useMarketStore(
    (s) => [s.activateAgent, s.agentList, s.agentLoading, s.currentAgentId, s.fetchAgentIndex],
  );
  const { styles } = useStyles();
  useEffect(() => {
    fetchAgentIndex();
  }, [fetchAgentIndex]);

  const [subscribed] = useAgentStore((s) => [agentListSelectors.subscribed(s)]);

  return (
    <GridList
      className={classNames(className, styles.list)}
      style={style}
      loading={agentLoading}
      items={agentList.map((items) => ({
        avatar: items.meta.avatar,
        id: items.agentId,
        name: items.meta.name,
      }))}
      onClick={(id) => {
        activateAgent(id);
      }}
      isActivated={(id) => id === currentAgentId}
      isChecked={(id) => subscribed(id)}
    />
  );
};

export default memo(AgentList);
