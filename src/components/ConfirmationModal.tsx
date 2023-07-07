import { Button, Group, Modal, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

type ButtonProps = {
  text: string;
  color?: string;
  variant: string;
  icon?: React.ReactNode;
};

type ConfirmationModalProps = {
  title?: string;
  text: string;
  opened: boolean;
  close: () => void;
  yesFunction: () => unknown;
  yesBtn?: ButtonProps;
  noBtn?: ButtonProps;
};

export function ConfirmationModal({
  title = "Attention",
  text,
  opened,
  close,
  yesFunction,
  yesBtn: {
    text: ybText = "Yes",
    color: ybColor = "teal",
    variant: ybVariant = "light",
    icon: ybIcon = <IconCheck size="1rem" className="-mb-0.5 -mr-1" />,
  } = {
    text: "Yes",
    color: "teal",
    variant: "light",
    icon: <IconCheck size="1rem" className="-mb-0.5 -mr-1" />,
  },
  noBtn: {
    text: nbText = "No",
    color: nbColor = "red",
    variant: nbVariant = "light",
    icon: nbIcon = <IconX size="1rem" className="-mb-0.5 -mr-1" />,
  } = {
    text: "No",
    color: "red",
    variant: "light",
    icon: <IconX size="1rem" className="-mb-0.5 -mr-1" />,
  },
}: ConfirmationModalProps) {
  const [functionHasRun, setFunctionHasRun] = useState(false);

  const yesFunctionWrapper = () => {
    if (!functionHasRun) {
      setFunctionHasRun(true);
      yesFunction();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={<b>{title}</b>} centered zIndex={99}>
        <Group position="left">
          <p className="text-gray-400">{text}</p>
        </Group>
        <Group position="right" className="mt-5">
          <Button variant={ybVariant} color={ybColor} onClick={yesFunctionWrapper} leftIcon={ybIcon}>
            {ybText}
          </Button>
          <Button variant={nbVariant} color={nbColor} onClick={close} leftIcon={nbIcon}>
            {nbText}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
