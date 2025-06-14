export interface Comment {
  id?: number;
  user_id?: number;
  username?: string;
  full_name?: string;
  product_id?: number;
  star?: number;
  created_date?: Date;
  updated_date?: Date;
  comment?: string;
  attachments?: string[];
  can_edit?: boolean;
}

export interface CreateCommentBody {
  product_id?: number;
  star?: number;
  attachments?: string[];
  comment?: string;
}
