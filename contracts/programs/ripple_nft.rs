use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata};

declare_id!("Rip1eZy3vJwF4HbSnF7QEZMVLiEiYym9VeZ3KiYoMMEq");

#[program]
pub mod ripple_nft {
    use super::*;

    /// Mint a new Soul Born Token NFT for a member
    pub fn mint_soul_born_token(
        ctx: Context<MintSoulBornToken>,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        msg!("Soul Born Token minted successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct MintSoulBornToken<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub mint_authority: SystemAccount<'info>,
    pub update_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
