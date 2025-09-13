export type Document = {
  id: number;
  doc_category_id: number;
  title: string;
  file_path: string;
  docCategory: {
    id: number;
    name: string;
  };
  created_at: string;
  document_number: string;
};
