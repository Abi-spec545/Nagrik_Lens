"""
Demo policy records dataset for PolicyMirror module.

Each policy record includes structured information for comparison
and outcome simulation.

IMPORTANT: These are reference templates for demo purposes.
Actual policy details must be verified from official gazette notifications.
"""

POLICY_RECORDS = {
    "EV-POLICY-2026-DRAFT": {
        "policy_id": "EV-POLICY-2026-DRAFT",
        "title": "Draft Electric Vehicle Policy 2026",
        "issuing_authority": "Ministry of Heavy Industries",
        "date_published": "2026-09-15",
        "status": "draft",
        "category": "transport",
        "key_clauses": [
            {
                "clause_id": "4a",
                "text": "Subsidies shall be disbursed subject to submission of Form V-B within thirty days of vehicle registration.",
                "impact_area": "subsidy_access",
                "deadline_days": 30,
            },
            {
                "clause_id": "4b",
                "text": "Maximum subsidy cap of INR 1,50,000 for two-wheelers and INR 3,00,000 for four-wheelers.",
                "impact_area": "subsidy_amount",
                "subsidy_cap_2w": 150000,
                "subsidy_cap_4w": 300000,
            },
            {
                "clause_id": "7",
                "text": "State governments may provide additional subsidies not exceeding 20% of ex-showroom price.",
                "impact_area": "state_top_up",
                "max_state_percent": 20,
            },
        ],
        "target_beneficiaries": ["individual_buyer", "fleet_operator", "manufacturer"],
    },
    "EV-POLICY-2024-ACTIVE": {
        "policy_id": "EV-POLICY-2024-ACTIVE",
        "title": "FAME-II Extension and EV Incentive Policy 2024",
        "issuing_authority": "Ministry of Heavy Industries",
        "date_published": "2024-03-01",
        "status": "active",
        "category": "transport",
        "key_clauses": [
            {
                "clause_id": "3a",
                "text": "Demand incentive of INR 10,000 per kWh for electric two-wheelers, capped at 40% of vehicle cost.",
                "impact_area": "subsidy_amount",
                "incentive_per_kwh": 10000,
                "max_percent_of_cost": 40,
            },
            {
                "clause_id": "3b",
                "text": "Incentive available only for vehicles with minimum 50% localization.",
                "impact_area": "manufacturing",
                "min_localization_percent": 50,
            },
            {
                "clause_id": "5",
                "text": "No additional state subsidy coordination mandated.",
                "impact_area": "state_top_up",
                "max_state_percent": None,
            },
        ],
        "target_beneficiaries": ["individual_buyer", "manufacturer"],
    },
    "RTI-ACT-2005": {
        "policy_id": "RTI-ACT-2005",
        "title": "Right to Information Act, 2005",
        "issuing_authority": "Ministry of Personnel, Public Grievances and Pensions",
        "date_published": "2005-06-15",
        "status": "active",
        "category": "governance",
        "key_clauses": [
            {
                "clause_id": "7.1",
                "text": "Information to be provided within 30 days of receipt of request.",
                "impact_area": "response_timeline",
                "deadline_days": 30,
            },
            {
                "clause_id": "7.5",
                "text": "If information concerns life or liberty, it shall be provided within 48 hours.",
                "impact_area": "urgent_response",
                "deadline_hours": 48,
            },
            {
                "clause_id": "19",
                "text": "First appeal to be filed within 30 days. Second appeal to Central/State Information Commission within 90 days.",
                "impact_area": "appeal_process",
                "first_appeal_days": 30,
                "second_appeal_days": 90,
            },
        ],
        "target_beneficiaries": ["general_citizen"],
    },
    "CONSUMER-PROTECTION-2019": {
        "policy_id": "CONSUMER-PROTECTION-2019",
        "title": "Consumer Protection Act, 2019",
        "issuing_authority": "Ministry of Consumer Affairs",
        "date_published": "2019-08-09",
        "status": "active",
        "category": "consumer_rights",
        "key_clauses": [
            {
                "clause_id": "34",
                "text": "Consumer Disputes Redressal Commission: District (up to INR 1 crore), State (1-10 crore), National (above 10 crore).",
                "impact_area": "jurisdiction",
            },
            {
                "clause_id": "35",
                "text": "Complaint to be filed within 2 years from the date of cause of action.",
                "impact_area": "filing_deadline",
                "deadline_years": 2,
            },
            {
                "clause_id": "39",
                "text": "Commission to decide complaint within 3 months (no testing) or 5 months (with testing).",
                "impact_area": "resolution_timeline",
                "resolution_months_no_test": 3,
                "resolution_months_with_test": 5,
            },
        ],
        "target_beneficiaries": ["general_citizen", "consumer"],
    },
}
