import PocketTransactionsTable from "@/components/pockets/PocketTransactions";

export default async function PocketTransactions({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <>
      <div className="container">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Pocket Transactions
        </h1>
        <PocketTransactionsTable pocketId={id} />
      </div>
    </>
  );
}
