import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user's invoices
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }
    
    // Format the invoices data
    const formattedInvoices = invoicesData.map(invoice => ({
      id: invoice.id,
      date: invoice.created_at,
      amount: `$${(invoice.amount / 100).toFixed(2)}`,
      status: invoice.status,
      invoiceUrl: invoice.invoice_url
    }));
    
    // Return the invoices data
    return NextResponse.json({
      success: true,
      invoices: formattedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
