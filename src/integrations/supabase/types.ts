export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company: {
        Row: {
          buyeraddress: string | null
          buyercontact: string | null
          buyeremail: string | null
          buyergst: string | null
          buyername: string
          created_at: string | null
          deliveryaddress: string | null
          id: string
          sameasbuyeraddress: boolean | null
        }
        Insert: {
          buyeraddress?: string | null
          buyercontact?: string | null
          buyeremail?: string | null
          buyergst?: string | null
          buyername: string
          created_at?: string | null
          deliveryaddress?: string | null
          id?: string
          sameasbuyeraddress?: boolean | null
        }
        Update: {
          buyeraddress?: string | null
          buyercontact?: string | null
          buyeremail?: string | null
          buyergst?: string | null
          buyername?: string
          created_at?: string | null
          deliveryaddress?: string | null
          id?: string
          sameasbuyeraddress?: boolean | null
        }
        Relationships: []
      }
      itemmaster: {
        Row: {
          buysellboth: string
          counterpartycode: string | null
          created_at: string | null
          currentstock: number | null
          defaultprice: number | null
          drawingnumber: string | null
          hsncode: string | null
          id: string
          itemcategory: string
          itemid: string
          itemname: string
          maximumstocklevel: number | null
          minimumstocklevel: number | null
          productservice: string
          serialnumber: string | null
          tax: string | null
          unitofmeasurement: string
        }
        Insert: {
          buysellboth: string
          counterpartycode?: string | null
          created_at?: string | null
          currentstock?: number | null
          defaultprice?: number | null
          drawingnumber?: string | null
          hsncode?: string | null
          id?: string
          itemcategory: string
          itemid: string
          itemname: string
          maximumstocklevel?: number | null
          minimumstocklevel?: number | null
          productservice: string
          serialnumber?: string | null
          tax?: string | null
          unitofmeasurement: string
        }
        Update: {
          buysellboth?: string
          counterpartycode?: string | null
          created_at?: string | null
          currentstock?: number | null
          defaultprice?: number | null
          drawingnumber?: string | null
          hsncode?: string | null
          id?: string
          itemcategory?: string
          itemid?: string
          itemname?: string
          maximumstocklevel?: number | null
          minimumstocklevel?: number | null
          productservice?: string
          serialnumber?: string | null
          tax?: string | null
          unitofmeasurement?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          buyer_details: Json | null
          created_at: string | null
          created_by: string | null
          deal_owner: string | null
          deal_status: string | null
          delivery_location: Json | null
          email_recipients: string | null
          enquiry_id: string
          id: string
          items: Json | null
          occreated: boolean | null
          order_date: string | null
          order_id: string | null
          place_of_supply: Json | null
          po_date: string | null
          po_id: string | null
          primary_document_details: Json | null
          quotation_date: string | null
          quotation_id: string | null
          sqcreated: boolean | null
          supplier_details: Json | null
          total_after_tax: number | null
          total_before_tax: number | null
          total_tax: number | null
          updated_at: string | null
        }
        Insert: {
          buyer_details?: Json | null
          created_at?: string | null
          created_by?: string | null
          deal_owner?: string | null
          deal_status?: string | null
          delivery_location?: Json | null
          email_recipients?: string | null
          enquiry_id: string
          id?: string
          items?: Json | null
          occreated?: boolean | null
          order_date?: string | null
          order_id?: string | null
          place_of_supply?: Json | null
          po_date?: string | null
          po_id?: string | null
          primary_document_details?: Json | null
          quotation_date?: string | null
          quotation_id?: string | null
          sqcreated?: boolean | null
          supplier_details?: Json | null
          total_after_tax?: number | null
          total_before_tax?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Update: {
          buyer_details?: Json | null
          created_at?: string | null
          created_by?: string | null
          deal_owner?: string | null
          deal_status?: string | null
          delivery_location?: Json | null
          email_recipients?: string | null
          enquiry_id?: string
          id?: string
          items?: Json | null
          occreated?: boolean | null
          order_date?: string | null
          order_id?: string | null
          place_of_supply?: Json | null
          po_date?: string | null
          po_id?: string | null
          primary_document_details?: Json | null
          quotation_date?: string | null
          quotation_id?: string | null
          sqcreated?: boolean | null
          supplier_details?: Json | null
          total_after_tax?: number | null
          total_before_tax?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      serial_numbers: {
        Row: {
          created_at: string | null
          form_type: string
          id: string
          last_number: number
        }
        Insert: {
          created_at?: string | null
          form_type: string
          id?: string
          last_number?: number
        }
        Update: {
          created_at?: string | null
          form_type?: string
          id?: string
          last_number?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          username: string | null
          usertype: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          username?: string | null
          usertype?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          username?: string | null
          usertype?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_serial_number: {
        Args: { form_type_param: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
