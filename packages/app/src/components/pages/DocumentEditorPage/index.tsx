"use client";

import type { DocumentRecord, SubscriptionResponse } from "@leadtech/contracts";
import { useCallback, type PropsWithChildren } from "react";

import { RichTextEditor } from "@/components/organisms/RichTextEditor";

type DocumentEditorPageProps = PropsWithChildren<{
  document: DocumentRecord;
  subscription: SubscriptionResponse;
}>;

export const DocumentEditorPage = ({ document, subscription }: DocumentEditorPageProps) => {
  const handleSubscriptionRequired = useCallback(() => undefined, []);

  return (
    <RichTextEditor
      document={document}
      editable={subscription.entitled}
      onSubscriptionRequired={handleSubscriptionRequired}
    />
  );
};
