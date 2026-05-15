// ─────────────────────────────────────────────────────────────────────────────
//  REACH – Synthetic Mock Datasets
//  RDB (Business Registry) · RRA (Tax / Income) · CRB (Credit / Loan History)
//  All data is FULLY SYNTHETIC – no real businesses, TINs, or identities.
// ─────────────────────────────────────────────────────────────────────────────

export type BusinessField =
  | "Agriculture"
  | "ICT"
  | "Trade"
  | "Construction"
  | "Finance"
  | "Health"
  | "Transport"
  | "Education"
  | "Manufacturing"
  | "Tourism";

export interface RDBRecord {
  Business_ID: string;
  Business_Name: string;
  Business_Description: string;
  Business_Field: BusinessField;
  Owner_Name: string;
}

export type TaxCategory = "Small" | "Medium" | "Large";
export type TaxComplianceStatus = "Compliant" | "Non-compliant" | "Partial";

export interface RRARecord {
  Business_ID: string;
  Annual_Income: number;   // RWF
  Monthly_Income: number;  // RWF
  Tax_Category: TaxCategory;
  Tax_Compliance_Status: TaxComplianceStatus;
}

export type LoanStatus = "Paid" | "Defaulted" | "Ongoing" | "No record";
export type PaymentHistory = "Good" | "Average" | "Poor";

export interface CRBRecord {
  Business_ID: string;
  Has_Loan: "Yes" | "No";
  Loan_Amount: number;     // RWF (0 if no loan)
  Loan_Status: LoanStatus;
  Credit_Score: number;    // 0–1000
  Payment_History: PaymentHistory;
}

// ─── RDB ─────────────────────────────────────────────────────────────────────
export const rdbData: RDBRecord[] = [
  { Business_ID: "RW-TIN-000001", Business_Name: "GreenLeaf Agro Ltd",          Business_Description: "Small-scale maize and bean farming cooperative supplying local markets.",              Business_Field: "Agriculture", Owner_Name: "Jean Bosco Niyitegeka" },
  { Business_ID: "RW-TIN-000002", Business_Name: "KigaliCode Solutions",         Business_Description: "Software development firm building mobile apps for Rwandan SMEs.",                   Business_Field: "ICT", Owner_Name: "Marie Claire Uwase" },
  { Business_ID: "RW-TIN-000003", Business_Name: "Urugendo Transport Co.",       Business_Description: "Intercity passenger and cargo transport operating major Rwandan routes.",             Business_Field: "Transport", Owner_Name: "Eric Munyaneza" },
  { Business_ID: "RW-TIN-000004", Business_Name: "Isoko General Shop",           Business_Description: "Retail shop stocking food, household goods, and fast-moving consumer products.",     Business_Field: "Trade", Owner_Name: "Alice Umutoni" },
  { Business_ID: "RW-TIN-000005", Business_Name: "Inzira Construction Ltd",      Business_Description: "Mid-size construction firm specialised in residential and commercial buildings.",     Business_Field: "Construction", Owner_Name: "David Habimana" },
  { Business_ID: "RW-TIN-000006", Business_Name: "Ubuzima Health Clinic",        Business_Description: "Private health clinic offering outpatient consultations and diagnostics.",            Business_Field: "Health", Owner_Name: "Dr. Sandrine Ishimwe" },
  { Business_ID: "RW-TIN-000007", Business_Name: "Agaciro Finance MFI",          Business_Description: "Microfinance institution providing small-business credit in rural Rwanda.",           Business_Field: "Finance", Owner_Name: "Thierry Nshuti" },
  { Business_ID: "RW-TIN-000008", Business_Name: "Soma Schools Network",         Business_Description: "Chain of affordable private primary and secondary schools across Kigali.",           Business_Field: "Education", Owner_Name: "Beatrice Mugisha" },
  { Business_ID: "RW-TIN-000009", Business_Name: "Ikirwa Textile Factory",       Business_Description: "Garment manufacturer producing uniforms and traditional Rwandan clothing.",          Business_Field: "Manufacturing", Owner_Name: "Samuel Bizimana" },
  { Business_ID: "RW-TIN-000010", Business_Name: "Akagera Safari Lodges",        Business_Description: "Eco-tourism lodges near Akagera National Park targeting international tourists.",   Business_Field: "Tourism", Owner_Name: "Grace Uwimana" },
  { Business_ID: "RW-TIN-000011", Business_Name: "Ejo Heza Tech Hub",            Business_Description: "Co-working and incubator space for early-stage technology startups.",               Business_Field: "ICT", Owner_Name: "Pascal Mutanguha" },
  { Business_ID: "RW-TIN-000012", Business_Name: "Ubuhinzi Dairy Farm",          Business_Description: "Dairy farming enterprise supplying fresh milk and yoghurt to Kigali retailers.",    Business_Field: "Agriculture", Owner_Name: "Fina Kayitesi" },
  { Business_ID: "RW-TIN-000013", Business_Name: "Butare Building Supplies",     Business_Description: "Wholesale distributor of cement, iron sheets, and construction materials.",          Business_Field: "Trade", Owner_Name: "Jean de Dieu Uwimana" },
  { Business_ID: "RW-TIN-000014", Business_Name: "Mugisha Road Contractors",     Business_Description: "Infrastructure firm focused on road rehabilitation and drainage works.",              Business_Field: "Construction", Owner_Name: "Anicet Gakuba" },
  { Business_ID: "RW-TIN-000015", Business_Name: "DataBridge Rwanda",            Business_Description: "Data analytics consultancy helping government agencies interpret census data.",       Business_Field: "ICT", Owner_Name: "Solange Muhawenimana" },
  { Business_ID: "RW-TIN-000016", Business_Name: "Nyungwe Forest Retreats",      Business_Description: "Boutique eco-lodge in Nyungwe offering guided forest and bird-watching tours.",     Business_Field: "Tourism", Owner_Name: "Gilbert Murenzi" },
  { Business_ID: "RW-TIN-000017", Business_Name: "Umuco Pharma Rwanda",          Business_Description: "Pharmaceutical distributor supplying essential medicines to local clinics.",          Business_Field: "Health", Owner_Name: "Innocent Ndayisaba" },
  { Business_ID: "RW-TIN-000018", Business_Name: "Kanda Transport Services",     Business_Description: "Last-mile delivery company using motorcycles and small trucks in Kigali.",          Business_Field: "Transport", Owner_Name: "Olivier Kwizera" },
  { Business_ID: "RW-TIN-000019", Business_Name: "Imbuto Seeds & Inputs",        Business_Description: "Agri-inputs retailer selling certified seeds and fertilisers to smallholders.",     Business_Field: "Agriculture", Owner_Name: "Jeanne d'Arc Mukamana" },
  { Business_ID: "RW-TIN-000020", Business_Name: "Integrity Capital Ltd",        Business_Description: "Investment advisory firm offering portfolio management to institutional clients.",   Business_Field: "Finance", Owner_Name: "Patrick Rugero" },
  { Business_ID: "RW-TIN-000021", Business_Name: "Nziza Clothing Boutique",      Business_Description: "Fashion retail store selling local and imported apparel in Kigali City Centre.",    Business_Field: "Trade", Owner_Name: "Veneranda Mukamanzi" },
  { Business_ID: "RW-TIN-000022", Business_Name: "Rubavu Beach Resort",          Business_Description: "Lakeside resort on Lake Kivu offering accommodation and water sports.",              Business_Field: "Tourism", Owner_Name: "Felicien Gasasira" },
  { Business_ID: "RW-TIN-000023", Business_Name: "Akabuye Timber Ltd",           Business_Description: "Sustainable timber processing company supplying furniture manufacturers.",           Business_Field: "Manufacturing", Owner_Name: "Claudine Uwera" },
  { Business_ID: "RW-TIN-000024", Business_Name: "Cel-Link Mobile Solutions",    Business_Description: "IT firm providing mobile payment integration services to banks and SACCOs.",        Business_Field: "ICT", Owner_Name: "Emmanuel Bizimana" },
  { Business_ID: "RW-TIN-000025", Business_Name: "Musanze Potato Growers Coop", Business_Description: "Farmer cooperative growing Irish potatoes for domestic and export markets.",       Business_Field: "Agriculture", Owner_Name: "Diane Umulisa" },
  { Business_ID: "RW-TIN-000026", Business_Name: "Rwego Construction Group",     Business_Description: "Large construction firm undertaking government-funded infrastructure projects.",    Business_Field: "Construction", Owner_Name: "Alphonse Kayitare" },
  { Business_ID: "RW-TIN-000027", Business_Name: "Ingorane Insurance Ltd",       Business_Description: "General insurance company providing motor, property, and health cover.",            Business_Field: "Finance", Owner_Name: "Prosper Nshuti" },
  { Business_ID: "RW-TIN-000028", Business_Name: "Premier Nursing Home",         Business_Description: "Private elder-care facility with specialised dementia and palliative services.",    Business_Field: "Health", Owner_Name: "Louise Mukandekezi" },
  { Business_ID: "RW-TIN-000029", Business_Name: "Shyira Coffee Exporters",      Business_Description: "Specialty coffee washing station and exporter serving European buyers.",            Business_Field: "Agriculture", Owner_Name: "Dr. Leonce Ngabo" },
  { Business_ID: "RW-TIN-000030", Business_Name: "Kigali Print & Media",         Business_Description: "Print shop offering large-format printing, branding, and signage solutions.",       Business_Field: "Manufacturing", Owner_Name: "Felix Mutabazi" },
  { Business_ID: "RW-TIN-000031", Business_Name: "Gisenyi Auto Garage",          Business_Description: "Motor vehicle repair and maintenance workshop serving local fleet operators.",       Business_Field: "Transport", Owner_Name: "Sandrine Umutesi" },
  { Business_ID: "RW-TIN-000032", Business_Name: "Ubumenyi Academy",             Business_Description: "Technical and vocational training centre offering ICT and electrical courses.",     Business_Field: "Education", Owner_Name: "Jean Paul Nkurunziza" },
  { Business_ID: "RW-TIN-000033", Business_Name: "Safi Water Technologies",      Business_Description: "SME producing affordable household water purification filters.",                    Business_Field: "Manufacturing", Owner_Name: "Yvonne Umulisa" },
  { Business_ID: "RW-TIN-000034", Business_Name: "Harvest Fresh Foods",          Business_Description: "Food processing company making packaged cassava flour and soya products.",          Business_Field: "Agriculture", Owner_Name: "Tharsice Rukundo" },
  { Business_ID: "RW-TIN-000035", Business_Name: "Kigali Secure Vaults",         Business_Description: "Private security company providing cash-in-transit and guarding services.",         Business_Field: "Finance", Owner_Name: "Medard Gatera" },
  { Business_ID: "RW-TIN-000036", Business_Name: "Irafasha Logistics",           Business_Description: "Cross-border freight company handling Rwanda–Uganda–DRC trade routes.",            Business_Field: "Transport", Owner_Name: "Laurent Niyonsaba" },
  { Business_ID: "RW-TIN-000037", Business_Name: "Umuzima Wellness Centre",      Business_Description: "Integrated wellness facility offering physiotherapy, gym, and nutrition services.", Business_Field: "Health", Owner_Name: "Aime Munyaneza" },
  { Business_ID: "RW-TIN-000038", Business_Name: "CloudNet Rwanda",              Business_Description: "Cloud hosting and managed IT services provider for enterprises.",                   Business_Field: "ICT", Owner_Name: "Josiane Uwimana" },
  { Business_ID: "RW-TIN-000039", Business_Name: "Ikaze Hospitality Ltd",        Business_Description: "Mid-range hotel chain with three properties in Kigali and Musanze.",               Business_Field: "Tourism", Owner_Name: "Elias Karekezi" },
  { Business_ID: "RW-TIN-000040", Business_Name: "Amahoro Grain Traders",        Business_Description: "Bulk commodity trader dealing in sorghum, rice, and wheat.",                       Business_Field: "Trade", Owner_Name: "Vestine Mukandayisenga" },
  { Business_ID: "RW-TIN-000041", Business_Name: "Turbo Delivery App",           Business_Description: "Tech startup building a last-mile delivery marketplace for Kigali restaurants.",   Business_Field: "ICT", Owner_Name: "Hassan Mugabo" },
  { Business_ID: "RW-TIN-000042", Business_Name: "Gira Fresh Juice Bar",         Business_Description: "Kiosk-based fresh fruit juice venture at Kigali Innovation City.",                 Business_Field: "Trade", Owner_Name: "Philomene Kayitesi" },
  { Business_ID: "RW-TIN-000043", Business_Name: "Sunrise Solar Rwanda",         Business_Description: "Solar panel installation startup targeting rural households.",                      Business_Field: "Manufacturing", Owner_Name: "Joseph Butera" },
  { Business_ID: "RW-TIN-000044", Business_Name: "EduBridge Tutors",             Business_Description: "Online tutoring platform connecting secondary students with qualified tutors.",    Business_Field: "Education", Owner_Name: "Solange Uwamahoro" },
  { Business_ID: "RW-TIN-000045", Business_Name: "Birdsong Aviary Farm",         Business_Description: "Poultry farm established in 2025 specialising in free-range eggs.",               Business_Field: "Agriculture", Owner_Name: "Christian Tuyisenge" },
  { Business_ID: "RW-TIN-000046", Business_Name: "Imuka Furniture Studio",       Business_Description: "New handcrafted furniture workshop supplying boutique hotels.",                    Business_Field: "Manufacturing", Owner_Name: "Angelique Umutesi" },
  { Business_ID: "RW-TIN-000047", Business_Name: "SafeRide Boda Hub",            Business_Description: "Motorcycle taxi aggregator app launched 2025, operating in Kigali.",               Business_Field: "Transport", Owner_Name: "Didier Rukundo" },
  { Business_ID: "RW-TIN-000048", Business_Name: "Icyeza Beauty Labs",           Business_Description: "Local cosmetics brand producing natural skincare from Rwandan ingredients.",       Business_Field: "Manufacturing", Owner_Name: "Immaculee Mukamana" },
  { Business_ID: "RW-TIN-000049", Business_Name: "Amani Guest House",            Business_Description: "Small guesthouse opened 2025 in Huye catering for student and NGO visitors.",     Business_Field: "Tourism", Owner_Name: "Charles Kayitare" },
  { Business_ID: "RW-TIN-000050", Business_Name: "DigiAds Rwanda",               Business_Description: "Digital marketing agency founded in early 2026 offering social media services.",  Business_Field: "ICT", Owner_Name: "Nadine Uwimana" },
];

// ─── RRA ─────────────────────────────────────────────────────────────────────
export const rraData: RRARecord[] = [
  { Business_ID: "RW-TIN-000001", Annual_Income:  3_600_000, Monthly_Income:   300_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000002", Annual_Income: 84_000_000, Monthly_Income: 7_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000003", Annual_Income: 60_000_000, Monthly_Income: 5_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000004", Annual_Income:  9_600_000, Monthly_Income:   800_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000005", Annual_Income:180_000_000, Monthly_Income:15_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000006", Annual_Income: 36_000_000, Monthly_Income: 3_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000007", Annual_Income: 72_000_000, Monthly_Income: 6_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000008", Annual_Income: 48_000_000, Monthly_Income: 4_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000009", Annual_Income:120_000_000, Monthly_Income:10_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000010", Annual_Income: 96_000_000, Monthly_Income: 8_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Non-compliant" },
  { Business_ID: "RW-TIN-000011", Annual_Income: 24_000_000, Monthly_Income: 2_000_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000012", Annual_Income: 18_000_000, Monthly_Income: 1_500_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000013", Annual_Income: 54_000_000, Monthly_Income: 4_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000014", Annual_Income:240_000_000, Monthly_Income:20_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000015", Annual_Income:108_000_000, Monthly_Income: 9_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000016", Annual_Income: 42_000_000, Monthly_Income: 3_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000017", Annual_Income: 66_000_000, Monthly_Income: 5_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000018", Annual_Income: 15_600_000, Monthly_Income: 1_300_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000019", Annual_Income:  7_200_000, Monthly_Income:   600_000, Tax_Category: "Small",  Tax_Compliance_Status: "Non-compliant" },
  { Business_ID: "RW-TIN-000020", Annual_Income:300_000_000, Monthly_Income:25_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000021", Annual_Income: 12_000_000, Monthly_Income: 1_000_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000022", Annual_Income: 78_000_000, Monthly_Income: 6_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000023", Annual_Income: 30_000_000, Monthly_Income: 2_500_000, Tax_Category: "Small",  Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000024", Annual_Income: 90_000_000, Monthly_Income: 7_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000025", Annual_Income:  6_000_000, Monthly_Income:   500_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000026", Annual_Income:360_000_000, Monthly_Income:30_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000027", Annual_Income:144_000_000, Monthly_Income:12_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000028", Annual_Income: 48_000_000, Monthly_Income: 4_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000029", Annual_Income: 54_000_000, Monthly_Income: 4_500_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000030", Annual_Income: 21_600_000, Monthly_Income: 1_800_000, Tax_Category: "Small",  Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000031", Annual_Income: 10_800_000, Monthly_Income:   900_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000032", Annual_Income: 27_600_000, Monthly_Income: 2_300_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000033", Annual_Income: 16_800_000, Monthly_Income: 1_400_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000034", Annual_Income: 33_600_000, Monthly_Income: 2_800_000, Tax_Category: "Medium", Tax_Compliance_Status: "Non-compliant" },
  { Business_ID: "RW-TIN-000035", Annual_Income:192_000_000, Monthly_Income:16_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000036", Annual_Income:156_000_000, Monthly_Income:13_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000037", Annual_Income: 27_600_000, Monthly_Income: 2_300_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000038", Annual_Income:204_000_000, Monthly_Income:17_000_000, Tax_Category: "Large",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000039", Annual_Income: 72_000_000, Monthly_Income: 6_000_000, Tax_Category: "Medium", Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000040", Annual_Income: 39_600_000, Monthly_Income: 3_300_000, Tax_Category: "Medium", Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000041", Annual_Income:  4_800_000, Monthly_Income:   400_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000042", Annual_Income:  2_400_000, Monthly_Income:   200_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000043", Annual_Income:  6_000_000, Monthly_Income:   500_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000044", Annual_Income:  3_600_000, Monthly_Income:   300_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000045", Annual_Income:  4_200_000, Monthly_Income:   350_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000046", Annual_Income:  7_200_000, Monthly_Income:   600_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000047", Annual_Income:  5_400_000, Monthly_Income:   450_000, Tax_Category: "Small",  Tax_Compliance_Status: "Partial" },
  { Business_ID: "RW-TIN-000048", Annual_Income:  8_400_000, Monthly_Income:   700_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000049", Annual_Income:  9_600_000, Monthly_Income:   800_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
  { Business_ID: "RW-TIN-000050", Annual_Income:  6_000_000, Monthly_Income:   500_000, Tax_Category: "Small",  Tax_Compliance_Status: "Compliant" },
];

// ─── CRB ─────────────────────────────────────────────────────────────────────
// Businesses 41–50 intentionally have NO CRB record (new businesses)
export const crbData: CRBRecord[] = [
  // Paid loans → high credit score 700–900
  { Business_ID: "RW-TIN-000001", Has_Loan: "Yes", Loan_Amount:  5_000_000, Loan_Status: "Paid",     Credit_Score: 780, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000002", Has_Loan: "Yes", Loan_Amount: 30_000_000, Loan_Status: "Paid",     Credit_Score: 860, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000004", Has_Loan: "Yes", Loan_Amount:  3_000_000, Loan_Status: "Paid",     Credit_Score: 720, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000006", Has_Loan: "Yes", Loan_Amount: 10_000_000, Loan_Status: "Paid",     Credit_Score: 810, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000007", Has_Loan: "Yes", Loan_Amount: 20_000_000, Loan_Status: "Paid",     Credit_Score: 875, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000009", Has_Loan: "Yes", Loan_Amount: 50_000_000, Loan_Status: "Paid",     Credit_Score: 900, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000013", Has_Loan: "Yes", Loan_Amount: 15_000_000, Loan_Status: "Paid",     Credit_Score: 760, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000015", Has_Loan: "Yes", Loan_Amount: 40_000_000, Loan_Status: "Paid",     Credit_Score: 840, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000017", Has_Loan: "Yes", Loan_Amount: 22_000_000, Loan_Status: "Paid",     Credit_Score: 795, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000020", Has_Loan: "Yes", Loan_Amount:100_000_000, Loan_Status: "Paid",     Credit_Score: 920, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000022", Has_Loan: "Yes", Loan_Amount: 25_000_000, Loan_Status: "Paid",     Credit_Score: 830, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000024", Has_Loan: "Yes", Loan_Amount: 35_000_000, Loan_Status: "Paid",     Credit_Score: 855, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000026", Has_Loan: "Yes", Loan_Amount:120_000_000, Loan_Status: "Paid",     Credit_Score: 910, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000029", Has_Loan: "Yes", Loan_Amount: 18_000_000, Loan_Status: "Paid",     Credit_Score: 770, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000031", Has_Loan: "Yes", Loan_Amount:  4_000_000, Loan_Status: "Paid",     Credit_Score: 730, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000035", Has_Loan: "Yes", Loan_Amount: 80_000_000, Loan_Status: "Paid",     Credit_Score: 890, Payment_History: "Good" },

  // Ongoing loans → mid credit score 550–750
  { Business_ID: "RW-TIN-000003", Has_Loan: "Yes", Loan_Amount: 25_000_000, Loan_Status: "Ongoing",  Credit_Score: 650, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000005", Has_Loan: "Yes", Loan_Amount: 60_000_000, Loan_Status: "Ongoing",  Credit_Score: 710, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000012", Has_Loan: "Yes", Loan_Amount:  8_000_000, Loan_Status: "Ongoing",  Credit_Score: 600, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000014", Has_Loan: "Yes", Loan_Amount: 90_000_000, Loan_Status: "Ongoing",  Credit_Score: 740, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000018", Has_Loan: "Yes", Loan_Amount:  5_000_000, Loan_Status: "Ongoing",  Credit_Score: 580, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000021", Has_Loan: "Yes", Loan_Amount:  6_000_000, Loan_Status: "Ongoing",  Credit_Score: 620, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000027", Has_Loan: "Yes", Loan_Amount: 45_000_000, Loan_Status: "Ongoing",  Credit_Score: 700, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000028", Has_Loan: "Yes", Loan_Amount: 15_000_000, Loan_Status: "Ongoing",  Credit_Score: 660, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000036", Has_Loan: "Yes", Loan_Amount: 70_000_000, Loan_Status: "Ongoing",  Credit_Score: 720, Payment_History: "Good" },
  { Business_ID: "RW-TIN-000038", Has_Loan: "Yes", Loan_Amount: 85_000_000, Loan_Status: "Ongoing",  Credit_Score: 750, Payment_History: "Good" },

  // Defaulted loans → low credit score 300–500
  { Business_ID: "RW-TIN-000008", Has_Loan: "Yes", Loan_Amount: 18_000_000, Loan_Status: "Defaulted", Credit_Score: 380, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000010", Has_Loan: "Yes", Loan_Amount: 35_000_000, Loan_Status: "Defaulted", Credit_Score: 310, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000016", Has_Loan: "Yes", Loan_Amount: 12_000_000, Loan_Status: "Defaulted", Credit_Score: 420, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000019", Has_Loan: "Yes", Loan_Amount:  3_500_000, Loan_Status: "Defaulted", Credit_Score: 350, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000023", Has_Loan: "Yes", Loan_Amount:  9_000_000, Loan_Status: "Defaulted", Credit_Score: 470, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000030", Has_Loan: "Yes", Loan_Amount:  7_000_000, Loan_Status: "Defaulted", Credit_Score: 400, Payment_History: "Poor" },
  { Business_ID: "RW-TIN-000034", Has_Loan: "Yes", Loan_Amount: 10_000_000, Loan_Status: "Defaulted", Credit_Score: 340, Payment_History: "Poor" },

  // No loans → neutral credit score 500–650
  { Business_ID: "RW-TIN-000011", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 545, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000025", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 510, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000032", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 560, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000033", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 530, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000037", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 575, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000039", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 620, Payment_History: "Average" },
  { Business_ID: "RW-TIN-000040", Has_Loan: "No",  Loan_Amount: 0,          Loan_Status: "No record", Credit_Score: 590, Payment_History: "Average" },
  // Businesses 41-50 have NO CRB record at all (new/startup businesses)
];
