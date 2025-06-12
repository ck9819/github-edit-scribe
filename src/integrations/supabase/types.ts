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
      audit_logs: {
        Row: {
          action: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_category_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
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
      customers: {
        Row: {
          billing_address: string | null
          contact_person: string | null
          created_at: string | null
          credit_limit: number | null
          email: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          name: string
          payment_terms: number | null
          phone: string | null
          shipping_address: string | null
        }
        Insert: {
          billing_address?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_terms?: number | null
          phone?: string | null
          shipping_address?: string | null
        }
        Update: {
          billing_address?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_terms?: number | null
          phone?: string | null
          shipping_address?: string | null
        }
        Relationships: []
      }
      goods_receipts: {
        Row: {
          created_at: string | null
          created_by: string | null
          grn_number: string
          id: string
          notes: string | null
          po_id: string
          receipt_date: string
          status: string | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          grn_number: string
          id?: string
          notes?: string | null
          po_id: string
          receipt_date: string
          status?: string | null
          warehouse_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          grn_number?: string
          id?: string
          notes?: string | null
          po_id?: string
          receipt_date?: string
          status?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goods_receipts_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipts_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      grn_items: {
        Row: {
          batch_number: string | null
          created_at: string | null
          expiry_date: string | null
          grn_id: string | null
          id: string
          po_item_id: string
          received_quantity: number
          unit_cost: number | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          grn_id?: string | null
          id?: string
          po_item_id: string
          received_quantity: number
          unit_cost?: number | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          grn_id?: string | null
          id?: string
          po_item_id?: string
          received_quantity?: number
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grn_items_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "goods_receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_po_item_id_fkey"
            columns: ["po_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      itemmaster: {
        Row: {
          brand_id: string | null
          buysellboth: string
          category_id: string | null
          counterpartycode: string | null
          created_at: string | null
          currentstock: number | null
          defaultprice: number | null
          drawingnumber: string | null
          expiry_tracking: boolean | null
          hsncode: string | null
          id: string
          is_active: boolean | null
          itemcategory: string
          itemid: string
          itemname: string
          maximumstocklevel: number | null
          minimumstocklevel: number | null
          productservice: string
          reorder_level: number | null
          serialnumber: string | null
          tax: string | null
          unitofmeasurement: string
        }
        Insert: {
          brand_id?: string | null
          buysellboth: string
          category_id?: string | null
          counterpartycode?: string | null
          created_at?: string | null
          currentstock?: number | null
          defaultprice?: number | null
          drawingnumber?: string | null
          expiry_tracking?: boolean | null
          hsncode?: string | null
          id?: string
          is_active?: boolean | null
          itemcategory: string
          itemid: string
          itemname: string
          maximumstocklevel?: number | null
          minimumstocklevel?: number | null
          productservice: string
          reorder_level?: number | null
          serialnumber?: string | null
          tax?: string | null
          unitofmeasurement: string
        }
        Update: {
          brand_id?: string | null
          buysellboth?: string
          category_id?: string | null
          counterpartycode?: string | null
          created_at?: string | null
          currentstock?: number | null
          defaultprice?: number | null
          drawingnumber?: string | null
          expiry_tracking?: boolean | null
          hsncode?: string | null
          id?: string
          is_active?: boolean | null
          itemcategory?: string
          itemid?: string
          itemname?: string
          maximumstocklevel?: number | null
          minimumstocklevel?: number | null
          productservice?: string
          reorder_level?: number | null
          serialnumber?: string | null
          tax?: string | null
          unitofmeasurement?: string
        }
        Relationships: [
          {
            foreignKeyName: "itemmaster_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itemmaster_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          reference_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          po_id: string | null
          quantity: number
          received_quantity: number | null
          unit_cost: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          po_id?: string | null
          quantity: number
          received_quantity?: number | null
          unit_cost: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          po_id?: string | null
          quantity?: number
          received_quantity?: number | null
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itemmaster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          status: string | null
          supplier_id: string
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date: string
          po_number: string
          status?: string | null
          supplier_id: string
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          status?: string | null
          supplier_id?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          buyer_details: Json | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          deal_owner: string | null
          deal_status: string | null
          delivery_location: Json | null
          discount_amount: number | null
          email_recipients: string | null
          enquiry_id: string
          id: string
          items: Json | null
          occreated: boolean | null
          order_date: string | null
          order_id: string | null
          payment_method: string | null
          payment_status: string | null
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
          warehouse_id: string | null
        }
        Insert: {
          buyer_details?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_owner?: string | null
          deal_status?: string | null
          delivery_location?: Json | null
          discount_amount?: number | null
          email_recipients?: string | null
          enquiry_id: string
          id?: string
          items?: Json | null
          occreated?: boolean | null
          order_date?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
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
          warehouse_id?: string | null
        }
        Update: {
          buyer_details?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_owner?: string | null
          deal_status?: string | null
          delivery_location?: Json | null
          discount_amount?: number | null
          email_recipients?: string | null
          enquiry_id?: string
          id?: string
          items?: Json | null
          occreated?: boolean | null
          order_date?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
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
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
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
      stock_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          item_id: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_date: string | null
          transaction_type: string
          unit_cost: number | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          item_id: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string | null
          transaction_type: string
          unit_cost?: number | null
          warehouse_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string | null
          transaction_type?: string
          unit_cost?: number | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itemmaster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          name: string
          payment_terms: number | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_terms?: number | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_terms?: number | null
          phone?: string | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_low_stock: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
