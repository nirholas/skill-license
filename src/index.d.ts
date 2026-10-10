// Type definitions for @three-ws/skill-license

export declare class ThreeWsError extends Error {
	name: string;
	code: string;
	status: number | null;
	detail?: string;
	retryAfter?: number;
	body: unknown;
}

export declare class PaymentRequiredError extends ThreeWsError {
	accepts: unknown | null;
}

export declare const DEFAULT_BASE_URL: string;

/** The `skill_license` Anchor program id — identical on every cluster. */
export declare const PROGRAM_ID: string;

export type SkillNetwork = 'mainnet' | 'devnet';

export interface SkillLicenseClientOptions {
	baseUrl?: string;
	fetch?: typeof fetch;
	/** Bearer token for authenticated calls (e.g. mintLicense). */
	apiKey?: string;
	headers?: Record<string, string>;
}

/**
 * Identify a license to read. Provide `holder`, `skill`, and **one** of
 * `agent` (the agent's on-chain skill-collection mint) or `agentId`
 * (a three.ws agent uuid, resolved to its collection mint server-side).
 */
export interface LicenseQuery {
	/** Base58 Solana pubkey of the wallet to check. */
	holder: string;
	/** The agent's on-chain grouping mint (its skill-collection mint). */
	agent?: string;
	/** Alternatively, a three.ws agent uuid. Pass `agent` OR `agentId`. */
	agentId?: string;
	/** Skill name/slug (≤100 chars). */
	skill: string;
	/** Which cluster to read. Default `'mainnet'`. */
	network?: SkillNetwork;
}

export interface ReadOptions {
	/** Override the cluster for this call. */
	network?: SkillNetwork;
	signal?: AbortSignal;
}

export interface LicenseRecord {
	/** Exists AND not revoked AND authority matches the holder. */
	owned: boolean;
	/** The PDA is present on-chain. */
	exists: boolean;
	/** True once revokedAt !== 0 (refunded / frozen). */
	revoked: boolean;
	/** The `skill_license` program is live on this cluster. */
	deployed: boolean;
	/** The wallet that owns the license. */
	authority: string | null;
	/** The agent grouping mint recorded on the license. */
	agentMint: string | null;
	/** The 1/1 SPL NFT mint backing the license. */
	nftMint: string | null;
	/** The holder's ATA for the NFT. */
	ownerTokenAccount: string | null;
	/** Human-readable skill identifier (≤64 bytes). */
	skillName: string | null;
	/** Hex SHA-256 of skillName (the third PDA seed). */
	skillHash: string | null;
	/** Unix seconds the license was minted. */
	purchaseDate: number | null;
	/** Unix seconds when revoked, or 0 while active. */
	revokedAt: number;
	/** The `SkillLicense` PDA address. */
	license: string | null;
	/** The `skill_license` program id. */
	programId: string;
	/** Cluster the record was read from. */
	network: string | null;
	/** Explorer link to the license account. */
	explorer: string | null;
	/** Escape hatch: the raw endpoint `data` envelope. */
	raw: unknown;
}

export interface MintLicenseInput {
	/** three.ws agent uuid. */
	agentId: string;
	/** Skill name/slug (≤100 chars). */
	skill: string;
	/** Recipient wallet — a Solana wallet linked to the caller's account. */
	buyer: string;
	/** Purchase transaction signature (optional; the latest attempt is used otherwise). */
	txSignature?: string;
	/** Bearer token for the authenticated three.ws account (overrides client apiKey). */
	apiKey?: string;
	/** Extra headers merged onto this request. */
	headers?: Record<string, string>;
}

export interface MintResult {
	nftMint: string | null;
	signature: string | null;
	collection: string | null;
	network: string | null;
	explorer: string | null;
	skill: string | null;
	agentId: string | null;
	purchaseId: string | null;
	/** A license already existed — treat as success. */
	alreadyMinted: boolean;
	/** Escape hatch: the raw endpoint `data` envelope. */
	raw: unknown;
}

export interface SkillLicenseClient {
	verifyLicense(input: LicenseQuery, opts?: ReadOptions): Promise<boolean>;
	getLicense(input: LicenseQuery, opts?: ReadOptions): Promise<LicenseRecord | null>;
	mintLicense(input: MintLicenseInput, opts?: { signal?: AbortSignal }): Promise<MintResult>;
}

export declare function createSkillLicense(options?: SkillLicenseClientOptions): SkillLicenseClient;
export declare function verifyLicense(input: LicenseQuery, opts?: ReadOptions): Promise<boolean>;
export declare function getLicense(input: LicenseQuery, opts?: ReadOptions): Promise<LicenseRecord | null>;
export declare function mintLicense(input: MintLicenseInput, opts?: { signal?: AbortSignal }): Promise<MintResult>;

/**
 * sha256(skillName) as a 32-byte hex string — the fixed-length third PDA seed.
 * Matches the program's `skill_seed()`. Pure, zero-dep, async (Web Crypto).
 */
export declare function skillSeed(skillName: string): Promise<string>;
