use anchor_lang::prelude::*;

declare_id!("Mem8erS7iP45R1NGrmVYs7eJ6MZYDJ1rG9qkNFYPfvE");

#[program]
pub mod ripple_membership {
    use super::*;

    /// Initialize membership program
    pub fn initialize(ctx: Context<Initialize>, config: MembershipConfig) -> Result<()> {
        ctx.accounts.membership_config.set_inner(config);
        Ok(())
    }

    /// Purchase membership
    pub fn purchase_membership(
        ctx: Context<PurchaseMembership>,
        _membership_tier: u8,
    ) -> Result<()> {
        msg!("Membership purchased!");
        Ok(())
    }

    /// Renew membership
    pub fn renew_membership(ctx: Context<RenewMembership>) -> Result<()> {
        msg!("Membership renewed!");
        Ok(())
    }
}

#[account]
pub struct MembershipConfig {
    pub annual_fee: u64,
    pub admin: Pubkey,
    pub fee_wallet: Pubkey,
    pub total_members: u32,
    pub is_active: bool,
}

#[account]
#[derive(Default)]
pub struct MemberAccount {
    pub member: Pubkey,
    pub tier: u8,
    pub start_date: i64,
    pub expiry_date: i64,
    pub is_active: bool,
    pub total_badges: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, space = 8 + 32 + 8 + 32 + 4 + 1, seeds = [b"config"], bump)]
    pub membership_config: Account<'info, MembershipConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct PurchaseMembership<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    #[account(init, payer = member, space = 8 + 32 + 1 + 8 + 8 + 1 + 1, seeds = [b"member", member.key().as_ref()], bump)]
    pub membership: Account<'info, MemberAccount>,
    pub membership_config: Account<'info, MembershipConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RenewMembership<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    #[account(mut, seeds = [b"member", member.key().as_ref()], bump)]
    pub membership: Account<'info, MemberAccount>,
    pub membership_config: Account<'info, MembershipConfig>,
}

#[error_code]
pub enum ErrorCode {
    MathOverflow,
    MembershipExpired,
    InvalidMembership,
}
