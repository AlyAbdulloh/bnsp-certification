export interface Document {
  id: number;
  document_number: string;
  doc_category_id: number;
  title: string;
  file_path: string;
  created_at: string;
  docCategory: {
    id: number;
    name: string;
  };
}
