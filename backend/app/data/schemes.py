"""
Demo scheme dataset for SchemeGraph module.

Each scheme entry includes:
- scheme_id: Unique identifier
- title: Official scheme name
- ministry: Administering ministry/department
- eligibility_rules: Deterministic criteria dict
- benefits: Short description of entitlements
- related_schemes: List of scheme_ids with overlapping benefits
- source_reference: Where this scheme info was documented (not a live URL)

IMPORTANT: These are reference templates for demo. Real eligibility must always
be confirmed against official government notifications.
"""

SCHEMES_DATASET = [
    {
        "scheme_id": "PM-KISAN-01",
        "title": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "description": "Direct income support of INR 6,000 per year to eligible farmer families.",
        "eligibility_rules": {
            "occupation": ["farmer"],
            "max_annual_income_inr": None,  # No income cap for small/marginal farmers
            "min_age": 18,
            "max_age": None,
            "gender": None,  # All genders
            "states": None,  # All states
            "caste_category": None,  # All categories
            "disability": None,  # Not a factor
            "land_ownership_required": True,
        },
        "benefits": "INR 6,000 per year in three equal installments directly to bank account.",
        "related_schemes": ["PM-FASAL-BIMA-01"],
        "source_reference": "PM-KISAN official scheme guidelines",
    },
    {
        "scheme_id": "PM-FASAL-BIMA-01",
        "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "description": "Crop insurance scheme providing financial support to farmers suffering crop loss.",
        "eligibility_rules": {
            "occupation": ["farmer"],
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,  # Tenant farmers also eligible
        },
        "benefits": "Crop insurance cover with premium subsidy. Kharif: 2%, Rabi: 1.5%, Commercial: 5%.",
        "related_schemes": ["PM-KISAN-01"],
        "source_reference": "PMFBY official scheme guidelines",
    },
    {
        "scheme_id": "PM-SVANIDHI-01",
        "title": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Micro-credit facility for street vendors to resume livelihood post-pandemic.",
        "eligibility_rules": {
            "occupation": ["street_vendor", "vendor", "hawker"],
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "Working capital loan up to INR 10,000 (1st), INR 20,000 (2nd), INR 50,000 (3rd tranche).",
        "related_schemes": ["PM-MUDRA-01"],
        "source_reference": "PM SVANidhi official scheme guidelines",
    },
    {
        "scheme_id": "PM-MUDRA-01",
        "title": "Pradhan Mantri MUDRA Yojana",
        "ministry": "Ministry of Finance",
        "description": "Loans up to INR 10 lakh for non-corporate, non-farm small/micro enterprises.",
        "eligibility_rules": {
            "occupation": ["self_employed", "artisan", "street_vendor", "vendor",
                           "trader", "shopkeeper", "micro_enterprise"],
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "Shishu (up to 50K), Kishore (50K-5L), Tarun (5L-10L) loan categories.",
        "related_schemes": ["PM-SVANIDHI-01"],
        "source_reference": "MUDRA official scheme guidelines",
    },
    {
        "scheme_id": "PMJDY-01",
        "title": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
        "ministry": "Ministry of Finance",
        "description": "Financial inclusion program ensuring access to financial services.",
        "eligibility_rules": {
            "occupation": None,  # Any occupation
            "max_annual_income_inr": None,
            "min_age": 10,  # Minor accounts with guardian from age 10
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "Zero-balance bank account, RuPay debit card, INR 2 lakh accident insurance.",
        "related_schemes": ["PMJJBY-01", "PMSBY-01"],
        "source_reference": "PMJDY official scheme guidelines",
    },
    {
        "scheme_id": "PMJJBY-01",
        "title": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        "ministry": "Ministry of Finance",
        "description": "Life insurance scheme offering coverage of INR 2 lakh.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": 50,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "INR 2 lakh life cover at INR 436 per annum premium.",
        "related_schemes": ["PMJDY-01", "PMSBY-01"],
        "source_reference": "PMJJBY official scheme guidelines",
    },
    {
        "scheme_id": "PMSBY-01",
        "title": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        "ministry": "Ministry of Finance",
        "description": "Accident insurance scheme covering death and disability.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": 70,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "INR 2 lakh (death/permanent total disability), INR 1 lakh (permanent partial) at INR 20/year.",
        "related_schemes": ["PMJDY-01", "PMJJBY-01"],
        "source_reference": "PMSBY official scheme guidelines",
    },
    {
        "scheme_id": "PM-UJJWALA-01",
        "title": "Pradhan Mantri Ujjwala Yojana (PMUY)",
        "ministry": "Ministry of Petroleum and Natural Gas",
        "description": "Free LPG connections to women from BPL households.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": 200000,
            "min_age": 18,
            "max_age": None,
            "gender": ["female"],
            "states": None,
            "caste_category": ["SC", "ST", "OBC", "General_BPL"],
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "Free LPG connection with deposit-free cylinder, regulator, and subsidy on refills.",
        "related_schemes": [],
        "source_reference": "PMUY official scheme guidelines",
    },
    {
        "scheme_id": "SUKANYA-SAMRIDDHI-01",
        "title": "Sukanya Samriddhi Yojana",
        "ministry": "Ministry of Finance",
        "description": "Savings scheme for girl child offering high interest rate with tax benefits.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": None,
            "min_age": 0,
            "max_age": 10,  # Account opened for girl child below 10 years
            "gender": ["female"],
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "High interest savings account (currently ~8%), tax exempt under 80C, matures at age 21.",
        "related_schemes": [],
        "source_reference": "Sukanya Samriddhi Yojana official guidelines",
    },
    {
        "scheme_id": "PMAY-01",
        "title": "Pradhan Mantri Awas Yojana (PMAY)",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Affordable housing with interest subsidy for economically weaker sections.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": 1800000,  # Up to 18 lakh for MIG-II
            "min_age": 21,
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,  # Must NOT own a pucca house
        },
        "benefits": "Interest subsidy of 3-6.5% on home loan for 20 years (EWS/LIG/MIG).",
        "related_schemes": [],
        "source_reference": "PMAY official scheme guidelines",
    },
    {
        "scheme_id": "NREGA-01",
        "title": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
        "ministry": "Ministry of Rural Development",
        "description": "Legal guarantee of 100 days of wage employment per year for rural households.",
        "eligibility_rules": {
            "occupation": None,
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": None,
            "gender": None,
            "states": None,  # Pan-India but rural areas
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "100 days guaranteed wage employment per household per year at notified wage rates.",
        "related_schemes": ["PM-KISAN-01"],
        "source_reference": "MGNREGA Act and official guidelines",
    },
    {
        "scheme_id": "PM-VISHWAKARMA-01",
        "title": "PM Vishwakarma Scheme",
        "ministry": "Ministry of Micro, Small and Medium Enterprises",
        "description": "Support for traditional artisans and craftspeople with training and credit.",
        "eligibility_rules": {
            "occupation": ["artisan", "carpenter", "blacksmith", "goldsmith",
                           "potter", "sculptor", "cobbler", "tailor", "weaver"],
            "max_annual_income_inr": None,
            "min_age": 18,
            "max_age": None,
            "gender": None,
            "states": None,
            "caste_category": None,
            "disability": None,
            "land_ownership_required": False,
        },
        "benefits": "Skill training, toolkit incentive (up to INR 15,000), collateral-free loans up to INR 3 lakh.",
        "related_schemes": ["PM-MUDRA-01"],
        "source_reference": "PM Vishwakarma official scheme guidelines",
    },
]
