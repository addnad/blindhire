import pkg from "hardhat"
const { ethers } = pkg

const BLINDHIRE_ADDRESS = "0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86"
const API_BASE = "http://localhost:3000"

const ROLES = [
  {
    title: "Senior Solidity Engineer",
    description: "Build and audit smart contracts for our DeFi protocol. Deep knowledge of EVM and gas optimization required.",
    category: "Engineering",
    minYears: 4,
    minScore: 80,
  },
  {
    title: "FHE Research Engineer",
    description: "Work on cutting-edge fully homomorphic encryption schemes and their applications in Web3 privacy.",
    category: "Engineering",
    minYears: 3,
    minScore: 85,
  },
  {
    title: "Protocol Designer",
    description: "Design tokenomics, governance mechanisms, and incentive structures for a new L2 ecosystem.",
    category: "Product",
    minYears: 2,
    minScore: 75,
  },
  {
    title: "Zero Knowledge Circuit Engineer",
    description: "Write and optimize ZK circuits using Circom and Halo2. Experience with proof systems required.",
    category: "Engineering",
    minYears: 3,
    minScore: 90,
  },
  {
    title: "Web3 Product Designer",
    description: "Design intuitive interfaces for complex on-chain interactions. Portfolio of dApp UX work required.",
    category: "Design",
    minYears: 2,
    minScore: 70,
  },
  {
    title: "DevRel Engineer",
    description: "Write technical content, build demos, and support developers integrating our SDK.",
    category: "Engineering",
    minYears: 1,
    minScore: 65,
  },
  {
    title: "Blockchain Security Auditor",
    description: "Audit Solidity contracts for vulnerabilities. Experience with common attack vectors and formal verification.",
    category: "Legal",
    minYears: 5,
    minScore: 95,
  },
]

async function encrypt(value: number, valueType: 'years' | 'score', userAddress: string) {
  const res = await fetch(`${API_BASE}/api/encrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, contractAddress: BLINDHIRE_ADDRESS, userAddress, valueType }),
    signal: AbortSignal.timeout(120000),
  })
  if (!res.ok) throw new Error(`Encrypt failed: ${await res.text()}`)
  return res.json() as Promise<{ handle: string; proof: string }>
}

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Seeding with account:", deployer.address)
  console.log("Contract:", BLINDHIRE_ADDRESS)

  const abi = [
    "function postRole(bytes32 _minYears, bytes calldata _minYearsProof, bytes32 _minScore, bytes calldata _minScoreProof, string calldata _title, string calldata _description, string calldata _category) external returns (uint256)"
  ]

  const contract = new ethers.Contract(BLINDHIRE_ADDRESS, abi, deployer)

  for (const role of ROLES) {
    console.log(`\nEncrypting & posting: ${role.title}`)

    const yearsEnc = await encrypt(role.minYears, 'years', deployer.address)
    const scoreEnc = await encrypt(role.minScore, 'score', deployer.address)

    const tx = await contract.postRole(
      yearsEnc.handle,
      yearsEnc.proof,
      scoreEnc.handle,
      scoreEnc.proof,
      role.title,
      role.description,
      role.category,
    )
    await tx.wait()
    console.log(`✓ Posted — tx: ${tx.hash}`)
  }

  console.log("\n✓ All 7 roles posted successfully.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
