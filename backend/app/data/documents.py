"""
Demo document requirements dataset for ClaimCraft module.

Maps each scheme_id to its required documents with categories,
statuses based on citizen context, and issuing authorities.

IMPORTANT: These are reference templates for demo purposes.
Actual requirements must be verified from official scheme portals.
"""

DOCUMENT_REQUIREMENTS = {
    "PM-KISAN-01": {
        "scheme_title": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "Unique Identification Authority of India (UIDAI)",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Passbook / Cancelled Cheque",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
            {
                "document_type": "Land Records",
                "name": "Land Ownership / Khasra-Khatauni Documents",
                "context_key": "has_land_documents",
                "mandatory": True,
                "issuing_authority": "Revenue Department / Tehsil Office",
            },
        ],
    },
    "PM-SVANIDHI-01": {
        "scheme_title": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "Unique Identification Authority of India (UIDAI)",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Passbook",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
            {
                "document_type": "Eligibility Proof",
                "name": "Certificate of Vending (CoV) / Letter of Recommendation",
                "context_key": "vendor_id_card",
                "mandatory": True,
                "issuing_authority": "Urban Local Body (ULB) / Town Vending Committee",
            },
        ],
    },
    "PM-MUDRA-01": {
        "scheme_title": "Pradhan Mantri MUDRA Yojana",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card / Voter ID / PAN Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI / Election Commission / Income Tax Department",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Details",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
            {
                "document_type": "Business Proof",
                "name": "Business Plan / Activity Proof",
                "context_key": "has_business_proof",
                "mandatory": True,
                "issuing_authority": "Self-Declaration / Municipal Corporation",
            },
            {
                "document_type": "Address Proof",
                "name": "Utility Bill / Rental Agreement for Business Premises",
                "context_key": "has_address_proof",
                "mandatory": False,
                "issuing_authority": "Utility Provider / Landlord",
            },
        ],
    },
    "PMJDY-01": {
        "scheme_title": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card (or any OVD)",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI / Respective issuing authority",
            },
        ],
    },
    "PMJJBY-01": {
        "scheme_title": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Financial",
                "name": "Savings Bank Account with Auto-debit Consent",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
        ],
    },
    "PMSBY-01": {
        "scheme_title": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Financial",
                "name": "Savings Bank Account with Auto-debit Consent",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
        ],
    },
    "PM-UJJWALA-01": {
        "scheme_title": "Pradhan Mantri Ujjwala Yojana (PMUY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Passbook",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
            {
                "document_type": "BPL Proof",
                "name": "BPL Ration Card / SECC Data Reference",
                "context_key": "has_bpl_card",
                "mandatory": True,
                "issuing_authority": "Food & Civil Supplies Department",
            },
        ],
    },
    "PMAY-01": {
        "scheme_title": "Pradhan Mantri Awas Yojana (PMAY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Financial",
                "name": "Income Certificate",
                "context_key": "has_income_certificate",
                "mandatory": True,
                "issuing_authority": "Revenue Department / Tehsildar",
            },
            {
                "document_type": "Property",
                "name": "Proof of Not Owning a Pucca House",
                "context_key": "has_no_pucca_house_declaration",
                "mandatory": True,
                "issuing_authority": "Self-Declaration / Municipal Corporation",
            },
        ],
    },
    "NREGA-01": {
        "scheme_title": "MGNREGA",
        "documents": [
            {
                "document_type": "Identity",
                "name": "MGNREGA Job Card",
                "context_key": "has_job_card",
                "mandatory": True,
                "issuing_authority": "Gram Panchayat / Block Development Office",
            },
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
        ],
    },
    "PM-VISHWAKARMA-01": {
        "scheme_title": "PM Vishwakarma Scheme",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Skill Proof",
                "name": "Self-Declaration of Traditional Trade / Craft Practice",
                "context_key": "has_trade_declaration",
                "mandatory": True,
                "issuing_authority": "Self-Declaration verified by Gram Panchayat / ULB",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Details",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
        ],
    },
    "SUKANYA-SAMRIDDHI-01": {
        "scheme_title": "Sukanya Samriddhi Yojana",
        "documents": [
            {
                "document_type": "Child Identity",
                "name": "Birth Certificate of Girl Child",
                "context_key": "has_birth_certificate",
                "mandatory": True,
                "issuing_authority": "Municipal Corporation / Gram Panchayat",
            },
            {
                "document_type": "Guardian Identity",
                "name": "Aadhaar / Identity of Parent/Guardian",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
        ],
    },
    "PM-FASAL-BIMA-01": {
        "scheme_title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "documents": [
            {
                "document_type": "Identity & Address",
                "name": "Aadhaar Card",
                "context_key": "has_aadhaar",
                "mandatory": True,
                "issuing_authority": "UIDAI",
            },
            {
                "document_type": "Land Records",
                "name": "Land Ownership / Lease Documents / Khasra-Khatauni",
                "context_key": "has_land_documents",
                "mandatory": True,
                "issuing_authority": "Revenue Department / Tehsil Office",
            },
            {
                "document_type": "Crop Details",
                "name": "Sowing Certificate / Crop Details Declaration",
                "context_key": "has_sowing_certificate",
                "mandatory": True,
                "issuing_authority": "Agriculture Department / Patwari",
            },
            {
                "document_type": "Financial",
                "name": "Bank Account Passbook",
                "context_key": "has_bank_account",
                "mandatory": True,
                "issuing_authority": "Respective Bank",
            },
        ],
    },
}
