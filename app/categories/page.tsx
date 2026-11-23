import AppLayout from '@/app/components/AppLayout';
import CategoriesHeader from '@/app/components/categories/CategoriesHeader';
import { authenticateUser } from '@/lib/supabase/actions';
import AllCategories from '@/app/components/categories/AllCategories';

import '@/styles/ListPage.css';
import '@/styles/all-transactions.css';
import CategorySummaryCards from '../components/categories/CategorySummaryCards';

export default async function Transactions() {
  await authenticateUser();

  return (
    <AppLayout>
      <main className="main-page">
        <CategoriesHeader />
        <CategorySummaryCards />
        <AllCategories />
      </main>
    </AppLayout>
  );
}
