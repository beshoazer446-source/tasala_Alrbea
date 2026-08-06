export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, total } = await req.json();
    if (!code) return NextResponse.json({ error: 'no_code' }, { status: 400 });

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('active', true)
      .single();

    if (error || !promo) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    // حد أدنى للطلب
    if (total < promo.min_order_amount) {
      return NextResponse.json({ error: 'min_order', min: promo.min_order_amount }, { status: 400 });
    }

    // تحقق من الأيام — مصر UTC+2
    if (promo.days_of_week && promo.days_of_week.length > 0) {
      const now = new Date();
      const egyptDay = new Date(now.getTime() + 2 * 60 * 60 * 1000).getDay();
      // getDay: 0=Sunday, 6=Saturday — نحوّل: 1=Sunday, 7=Saturday
      const dayNum = egyptDay === 0 ? 1 : egyptDay + 1;
      if (!promo.days_of_week.includes(dayNum)) {
        const dayNames: Record<number,string> = {
          1:'الأحد', 2:'الاثنين', 3:'الثلاثاء',
          4:'الأربعاء', 5:'الخميس', 6:'الجمعة', 7:'السبت'
        };
        const validDays = promo.days_of_week.map((d: number) => dayNames[d]).join(' و');
        return NextResponse.json({ error: 'wrong_day', valid_days: validDays }, { status: 400 });
      }
    }

    // تاريخ الانتهاء
    if (promo.end_date) {
      const today = new Date().toISOString().split('T')[0];
      if (today > promo.end_date) return NextResponse.json({ error: 'expired' }, { status: 400 });
    }

    // حد الاستخدامات
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return NextResponse.json({ error: 'max_uses' }, { status: 400 });
    }

return NextResponse.json({
      success: true,
      discount: promo.discount_type === 'percent'
        ? Math.round(total * promo.discount_amount / 100)
        : promo.discount_amount,
      type: promo.discount_type,
      code: promo.code,
    });

  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
