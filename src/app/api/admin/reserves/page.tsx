import ProofOfReserves from "@/components/admin/proof-of-reserves"

export default function ReservesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Proof of Reserves</h1>
      <p className="text-gray-600 mb-6">
        View the current reserves backing the cGHS stablecoin. This data is verified through a secure proof mechanism.
      </p>

      <ProofOfReserves />
    </div>
  )
}

