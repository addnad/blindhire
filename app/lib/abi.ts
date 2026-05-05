export const BLINDHIRE_ADDRESS = (process.env.NEXT_PUBLIC_BLINDHIRE_ADDRESS ?? "0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86") as `0x${string}`

export const BLINDHIRE_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "applicationId", "type": "uint256" }, { "indexed": true, "name": "roleId", "type": "uint256" }, { "indexed": true, "name": "candidate", "type": "address" }], "name": "ApplicationSubmitted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "applicationId", "type": "uint256" }], "name": "MatchComputed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "applicationId", "type": "uint256" }, { "indexed": true, "name": "roleId", "type": "uint256" }, { "indexed": true, "name": "candidate", "type": "address" }], "name": "MatchRevealed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "roleId", "type": "uint256" }, { "indexed": true, "name": "employer", "type": "address" }, { "indexed": false, "name": "title", "type": "string" }], "name": "RolePosted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "roleId", "type": "uint256" }, { "indexed": true, "name": "employer", "type": "address" }], "name": "RoleClosed", "type": "event" },
  { "inputs": [{ "name": "roleId", "type": "uint256" }, { "name": "_years", "type": "bytes32" }, { "name": "_yearsProof", "type": "bytes" }, { "name": "_score", "type": "bytes32" }, { "name": "_scoreProof", "type": "bytes" }], "name": "applyForRole", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "_minYears", "type": "bytes32" }, { "name": "_minYearsProof", "type": "bytes" }, { "name": "_minScore", "type": "bytes32" }, { "name": "_minScoreProof", "type": "bytes" }, { "name": "_title", "type": "string" }, { "name": "_description", "type": "string" }, { "name": "_category", "type": "string" }], "name": "postRole", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "appId", "type": "uint256" }], "name": "confirmMatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "roleId", "type": "uint256" }], "name": "closeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "appId", "type": "uint256" }], "name": "getMatchResult", "outputs": [{ "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "appId", "type": "uint256" }], "name": "getMatchDetails", "outputs": [{ "name": "yearsOk", "type": "bytes32" }, { "name": "scoreOk", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "roleId", "type": "uint256" }], "name": "getRoleMetadata", "outputs": [{ "name": "title", "type": "string" }, { "name": "description", "type": "string" }, { "name": "category", "type": "string" }, { "name": "employer", "type": "address" }, { "name": "active", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "roleId", "type": "uint256" }], "name": "getRoleStats", "outputs": [{ "name": "applicantCount", "type": "uint256" }, { "name": "matchCount", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "appId", "type": "uint256" }], "name": "getApplicationInfo", "outputs": [{ "name": "roleId", "type": "uint256" }, { "name": "computed", "type": "bool" }, { "name": "matchRevealed", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "employer", "type": "address" }], "name": "getEmployerRoles", "outputs": [{ "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "candidate", "type": "address" }], "name": "getCandidateApplications", "outputs": [{ "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "roleCount", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "applicationCount", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "hasApplied", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "", "type": "uint256" }], "name": "roleMatchCount", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "", "type": "uint256" }], "name": "roleApplicationCount", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const
