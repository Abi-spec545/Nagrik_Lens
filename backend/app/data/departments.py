"""
Demo department routing dataset for CivicRoute module.

Maps grievance categories to department hierarchies, SLAs,
escalation tiers, and filing channels.

IMPORTANT: These are reference templates for demo. Actual department contacts,
SLAs, and escalation procedures must be verified from official citizen charters.
"""

DEPARTMENT_ROUTES = {
    "water_supply": {
        "category": "water_supply",
        "category_label": "Water Supply & Quality",
        "departments": {
            "Karnataka": {
                "Bengaluru": {
                    "primary_department": "Bangalore Water Supply and Sewerage Board (BWSSB)",
                    "officer_designation": "Assistant Executive Engineer (Water Quality Division)",
                    "filing_channel": "BWSSB Citizen Portal / Helpline 1916",
                    "sla_days": 7,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Sub-Division)",
                            "trigger_condition": "Unresolved after 7 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Appellate Authority",
                            "trigger_condition": "Unresolved after 15 business days",
                        },
                    ],
                },
                "_default": {
                    "primary_department": "Karnataka Urban Water Supply and Drainage Board",
                    "officer_designation": "Executive Engineer (Division)",
                    "filing_channel": "District Commissioner Office / Helpline 1902",
                    "sla_days": 10,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Superintending Engineer",
                            "trigger_condition": "Unresolved after 10 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Managing Director",
                            "trigger_condition": "Unresolved after 21 business days",
                        },
                    ],
                },
            },
            "Maharashtra": {
                "Mumbai": {
                    "primary_department": "Brihanmumbai Municipal Corporation (BMC) - Hydraulic Engineering",
                    "officer_designation": "Assistant Engineer (Water Works)",
                    "filing_channel": "BMC Portal / Helpline 1800-22-1292",
                    "sla_days": 5,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Ward Level)",
                            "trigger_condition": "Unresolved after 5 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Deputy Municipal Commissioner (Infrastructure)",
                            "trigger_condition": "Unresolved after 14 business days",
                        },
                    ],
                },
                "_default": {
                    "primary_department": "Maharashtra Jeevan Pradhikaran (MJP)",
                    "officer_designation": "Executive Engineer (Division)",
                    "filing_channel": "District Collectorate / MJP Helpline",
                    "sla_days": 10,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Superintending Engineer",
                            "trigger_condition": "Unresolved after 10 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Member Secretary",
                            "trigger_condition": "Unresolved after 21 business days",
                        },
                    ],
                },
            },
            "_default": {
                "_default": {
                    "primary_department": "Public Health Engineering Department (PHED)",
                    "officer_designation": "Executive Engineer (Division)",
                    "filing_channel": "District Collectorate / State Helpline",
                    "sla_days": 10,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Superintending Engineer (Circle)",
                            "trigger_condition": "Unresolved after 10 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Secretary (PHED)",
                            "trigger_condition": "Unresolved after 21 business days",
                        },
                    ],
                },
            },
        },
    },
    "electricity": {
        "category": "electricity",
        "category_label": "Electricity & Power Supply",
        "departments": {
            "Karnataka": {
                "Bengaluru": {
                    "primary_department": "Bangalore Electricity Supply Company Limited (BESCOM)",
                    "officer_designation": "Assistant Executive Engineer (O&M Sub-Division)",
                    "filing_channel": "BESCOM Portal / Helpline 1912",
                    "sla_days": 3,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Division)",
                            "trigger_condition": "Unresolved after 3 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Superintending Engineer / CGRF (Consumer Grievance Redressal Forum)",
                            "trigger_condition": "Unresolved after 10 business days",
                        },
                    ],
                },
                "_default": {
                    "primary_department": "Respective State DISCOM (HESCOM/CESC/GESCOM/MESCOM)",
                    "officer_designation": "Assistant Executive Engineer (Sub-Division)",
                    "filing_channel": "DISCOM Helpline / District Office",
                    "sla_days": 5,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Division)",
                            "trigger_condition": "Unresolved after 5 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "CGRF / Electricity Ombudsman",
                            "trigger_condition": "Unresolved after 14 business days",
                        },
                    ],
                },
            },
            "_default": {
                "_default": {
                    "primary_department": "State Electricity Distribution Company (DISCOM)",
                    "officer_designation": "Sub-Divisional Officer (SDO)",
                    "filing_channel": "DISCOM Consumer Portal / State Helpline",
                    "sla_days": 5,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Division)",
                            "trigger_condition": "Unresolved after 5 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Consumer Grievance Redressal Forum (CGRF) / Electricity Ombudsman",
                            "trigger_condition": "Unresolved after 14 business days",
                        },
                    ],
                },
            },
        },
    },
    "road_maintenance": {
        "category": "road_maintenance",
        "category_label": "Road & Infrastructure Maintenance",
        "departments": {
            "Karnataka": {
                "Bengaluru": {
                    "primary_department": "Bruhat Bengaluru Mahanagara Palike (BBMP) - Road Infrastructure",
                    "officer_designation": "Assistant Executive Engineer (Roads - Ward Level)",
                    "filing_channel": "BBMP Sahaya Portal / Helpline 080-22660000",
                    "sla_days": 7,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Zone)",
                            "trigger_condition": "Unresolved after 7 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer (Projects) / Zonal Commissioner",
                            "trigger_condition": "Unresolved after 15 business days",
                        },
                    ],
                },
                "_default": {
                    "primary_department": "Public Works Department (PWD) - Karnataka",
                    "officer_designation": "Assistant Executive Engineer (Sub-Division)",
                    "filing_channel": "PWD District Office / District Collectorate",
                    "sla_days": 14,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Executive Engineer (Division)",
                            "trigger_condition": "Unresolved after 14 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Secretary (PWD)",
                            "trigger_condition": "Unresolved after 30 business days",
                        },
                    ],
                },
            },
            "_default": {
                "_default": {
                    "primary_department": "Public Works Department (PWD) / Municipal Corporation",
                    "officer_designation": "Executive Engineer (Roads Division)",
                    "filing_channel": "District Collectorate / Municipal Corporation Office",
                    "sla_days": 14,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Superintending Engineer (Circle)",
                            "trigger_condition": "Unresolved after 14 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Chief Engineer / Secretary (PWD)",
                            "trigger_condition": "Unresolved after 30 business days",
                        },
                    ],
                },
            },
        },
    },
    "sanitation": {
        "category": "sanitation",
        "category_label": "Sanitation & Solid Waste Management",
        "departments": {
            "_default": {
                "_default": {
                    "primary_department": "Municipal Corporation / Nagar Palika - Sanitation Wing",
                    "officer_designation": "Sanitary Inspector / Health Officer (Ward)",
                    "filing_channel": "Municipal Corporation Portal / Ward Councillor Office",
                    "sla_days": 3,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Chief Sanitary Officer / Medical Officer of Health",
                            "trigger_condition": "Unresolved after 3 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Municipal Commissioner / District Magistrate",
                            "trigger_condition": "Unresolved after 10 business days",
                        },
                    ],
                },
            },
        },
    },
    "property_tax": {
        "category": "property_tax",
        "category_label": "Property Tax & Assessment",
        "departments": {
            "_default": {
                "_default": {
                    "primary_department": "Municipal Corporation - Revenue / Tax Department",
                    "officer_designation": "Revenue Inspector / Assistant Revenue Officer",
                    "filing_channel": "Municipal Corporation Office / Online Property Tax Portal",
                    "sla_days": 15,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Revenue Officer / Deputy Commissioner (Revenue)",
                            "trigger_condition": "Unresolved after 15 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Municipal Commissioner / Standing Committee",
                            "trigger_condition": "Unresolved after 30 business days",
                        },
                    ],
                },
            },
        },
    },
    "ration_pds": {
        "category": "ration_pds",
        "category_label": "Ration / Public Distribution System",
        "departments": {
            "_default": {
                "_default": {
                    "primary_department": "Department of Food & Civil Supplies",
                    "officer_designation": "Food Inspector / Taluk Supply Officer",
                    "filing_channel": "District Supply Office / PDS Helpline 1967",
                    "sla_days": 7,
                    "escalation_levels": [
                        {
                            "tier": 1,
                            "officer": "Deputy Director (Food & Civil Supplies)",
                            "trigger_condition": "Unresolved after 7 business days",
                        },
                        {
                            "tier": 2,
                            "officer": "Director / Commissioner (Food & Civil Supplies) / District Collector",
                            "trigger_condition": "Unresolved after 15 business days",
                        },
                    ],
                },
            },
        },
    },
}
