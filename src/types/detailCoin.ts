

export interface detailCoin {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  description: {
    en: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      [currency: string]: number;
    };
    market_cap: {
      [currency: string]: number;
    };
    high_24h: {
      [currency: string]: number;
    };
    low_24h: {
      [currency: string]: number;
    };
    price_change_percentage_7d: number;
    total_volume :{
        [currency: string]: number;
    };
    fully_diluted_valuation: {
        [currency: string]: number;
    }
    ath :{
        [Currency: string]: number;
    }
    ath_date :{
        [Date : string]: string;
    }
    atl :{
        [Currency: string]: number;
    }
    atl_date :{
        [Currency: string]: string;
    }

    total_supply: number;
    circulating_supply: number;

    max_supply: number;


  };
  hashing_algorithm: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    twitter_screen_name: string;
    subreddit_url: string;
  };

}
