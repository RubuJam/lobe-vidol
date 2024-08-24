import { ActionIcon, Form, FormItem } from '@lobehub/ui';
import { VRMExpressionPresetName } from '@pixiv/three-vrm';
import { Input, Modal, Select } from 'antd';
import { Edit2Icon, Plus } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { INPUT_WIDTH_M, INPUT_WIDTH_S } from '@/constants/token';
import { MAX_TOUCH_ACTION_TEXT_LENGTH, TOUCH_MOTION_ANIMATION } from '@/constants/touch';
import { useSettingStore } from '@/store/setting';
import { GenderEnum } from '@/types/agent';
import { TouchAction, TouchAreaEnum } from '@/types/touch';

export interface Props {
  gender: GenderEnum;
  index?: number;
  isEdit?: boolean;
  touchAction?: TouchAction;
  touchArea: TouchAreaEnum;
}

const AddOrEdit = memo<Props>(({ touchArea, index, touchAction, isEdit = true, gender }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation('common');

  const [updateTouchAction, createTouchAction] = useSettingStore((s) => [
    s.updateTouchAction,
    s.createTouchAction,
  ]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setOpen(false);
      if (isEdit) {
        updateTouchAction(gender, touchArea, index!, values);
      } else {
        createTouchAction(gender, touchArea, values);
      }
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <ActionIcon
        icon={isEdit ? Edit2Icon : Plus}
        title={isEdit ? t('actions.edit') : t('actions.add')}
        onClick={showModal}
      />
      <Modal
        onCancel={handleCancel}
        onOk={handleOk}
        open={open}
        width={800}
        destroyOnClose
        title={
          isEdit ? t('touch.editAction', { ns: 'role' }) : t('touch.addAction', { ns: 'role' })
        }
        okText={t('confirm')}
        cancelText={t('cancel')}
      >
        <Form
          layout="horizontal"
          requiredMark
          initialValues={isEdit ? touchAction : { emotion: VRMExpressionPresetName.Neutral }}
          form={form}
          preserve={false}
        >
          <FormItem
            label={t('info.textLabel', { ns: 'role' })}
            desc={t('info.textDescription', { ns: 'role' })}
            name={'text'}
            rules={[{ required: true, message: t('touch.inputDIYText', { ns: 'role' }) }]}
          >
            <Input.TextArea
              placeholder={t('touch.inputActionText', { ns: 'role' })}
              maxLength={MAX_TOUCH_ACTION_TEXT_LENGTH}
              showCount
              autoSize
              style={{ width: INPUT_WIDTH_M }}
            />
          </FormItem>
          <FormItem
            label={t('info.emotionLabel', { ns: 'role' })}
            desc={t('info.emotionDescription', { ns: 'role' })}
            divider
            rules={[{ required: true, message: t('touch.inputActionEmotion', { ns: 'role' }) }]}
            name="emotion"
          >
            <Select
              options={[
                {
                  label: t('touch.emotion.natural', { ns: 'role' }),
                  value: VRMExpressionPresetName.Neutral,
                },
                {
                  label: t('touch.emotion.happy', { ns: 'role' }),
                  value: VRMExpressionPresetName.Happy,
                },
                {
                  label: t('touch.emotion.angry', { ns: 'role' }),
                  value: VRMExpressionPresetName.Angry,
                },
                {
                  label: t('touch.emotion.sad', { ns: 'role' }),
                  value: VRMExpressionPresetName.Sad,
                },
                {
                  label: t('touch.emotion.relaxed', { ns: 'role' }),
                  value: VRMExpressionPresetName.Relaxed,
                },
                {
                  label: t('touch.emotion.surprised', { ns: 'role' }),
                  value: VRMExpressionPresetName.Surprised,
                },
                {
                  label: t('touch.emotion.blink', { ns: 'role' }),
                  value: VRMExpressionPresetName.Blink,
                },
                {
                  label: t('touch.emotion.blinkLeft', { ns: 'role' }),
                  value: VRMExpressionPresetName.BlinkLeft,
                },
                {
                  label: t('touch.emotion.blinkRight', { ns: 'role' }),
                  value: VRMExpressionPresetName.BlinkRight,
                },
              ]}
              style={{ width: INPUT_WIDTH_S }}
              defaultActiveFirstOption={true}
            />
          </FormItem>
          <FormItem
            label={t('info.motionLabel', { ns: 'role' })}
            desc={t('info.motionDescription', { ns: 'role' })}
            divider
            rules={[{ required: true, message: t('touch.inputActionEmotion', { ns: 'role' }) }]}
            name="motion"
          >
            <Select
              options={TOUCH_MOTION_ANIMATION.map((item) => ({
                label: `${item.gender}/${item.name}`,
                value: item.id,
              }))}
              style={{ width: INPUT_WIDTH_S }}
              defaultActiveFirstOption={true}
            />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
});

export default AddOrEdit;
