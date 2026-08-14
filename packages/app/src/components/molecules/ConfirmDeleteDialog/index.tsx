"use client";

import { IconTrash } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { en } from "@/data/locale/en";

type ConfirmDeleteDialogProps = PropsWithChildren<{
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
}>;

export const ConfirmDeleteDialog = ({
  deleting,
  onClose,
  onConfirm,
  open,
}: ConfirmDeleteDialogProps) => (
  <Dialog labelledBy="delete-dialog-title" onClose={onClose} open={open}>
    <div className="w-[min(92vw,28rem)] p-7">
      <span className="grid size-11 place-items-center rounded-lg bg-pale-red text-danger">
        <IconTrash size={21} stroke={1.8} />
      </span>
      <Heading className="mt-5 text-2xl" id="delete-dialog-title" level={2}>
        {en.documents.deleteTitle}
      </Heading>
      <Text className="mt-2 text-sm">{en.documents.deleteDescription}</Text>
      <div className="mt-7 flex justify-end gap-3">
        <Button onClick={onClose} variant="secondary">
          {en.documents.deleteCancel}
        </Button>
        <Button loading={deleting} onClick={onConfirm} variant="danger">
          {en.documents.deleteConfirm}
        </Button>
      </div>
    </div>
  </Dialog>
);
