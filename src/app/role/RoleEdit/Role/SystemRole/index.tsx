import { Input } from 'antd';
import React, { CSSProperties, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { MAX_SYSTEM_ROLE_LENGTH } from '@/constants/common';
import { agentSelectors, useAgentStore } from '@/store/agent';

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default memo<Props>((props) => {
  const { style, className } = props;
  const inputRef = useRef(null);
  const [systemRole, updateAgentConfig] = useAgentStore((s) => [
    agentSelectors.currentAgentItem(s)?.systemRole,
    s.updateAgentConfig,
  ]);
  const { t } = useTranslation('role');
  return (
    <Input.TextArea
      ref={inputRef}
      className={className}
      style={style}
      value={systemRole}
      autoSize={{ minRows: 16 }}
      placeholder={t('role.inputRoleSetting')}
      showCount
      maxLength={MAX_SYSTEM_ROLE_LENGTH}
      onChange={(e) => {
        updateAgentConfig({ systemRole: e.target.value });
      }}
    />
  );
});
