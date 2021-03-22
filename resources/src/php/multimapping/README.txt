========================================================================================	
Setting up python and installing required libraries
========================================================================================
1/Install python
	Download and python from https://www.python.org/downloads/ make sure you get a 3.X version and not a 2.X, the scripts were written using python 3.4.6
	During python installation check the box : "Add python to PATH" so that you can easily call the scripts later
	During the installation also install pip that will be used to download and install the required libararies in the next steps

2/Install required libraries:
	-set the current directory to the directory containing all the python files
	-in command line run : pip install -r requirements.txt

	
	
========================================================================================	
Mapping on ChEBI classes using json files (metabolites of network and lipidomic results)
========================================================================================
1/ Set the aliases in the conf_json.txt file:
	replace the aliases for the identifiers by the one used in the json file that will be parsed.

	
3/run the mapping script
	in command line: python mapping_json.py lipidomic_json_path metabolites_json_path output_path json_conf_file_path, mapping_types
			
			-> mapping_types : 1 = exact multimapping
							   2 = chebi class mapping
							   3 = lipidmaps class mapping
							   4 = smiles class mapping
							   To use multiple mapping at once use commas, for example 1,2 for exact mapping and chebi mapping
							   Take care when using different class mappings at the same time (lipidmaps/chebi or smiles) as you can't compare their distances
							   Output consider results in this order of priority: Exact multimapping > chebi class mapping > lipidmaps mapping > smiles class mapping		
	
	
========================================================================================	
Mapping using tsv files (metabolites of network and lipidomic results)
========================================================================================

1/open the conf_tsv.txt file in the main directory to set the names of the columns in the metabolites file and the lipid file
	There is no need for every column to be present in your files
	In case some metabolites can have multiple of the same type of identifiers, you can also set the separator character (by default "|")

2/run the mapping script using command line:
	2.1 Place yourself in the work directory where the python files are present using the cd command , note that you will have to specify the relative path to your files (metabolites, lipid file and conf file)
	
	2.2 type the following to run the script:
		
		python mapping_tsv.py lipidomic_tsv_path metabolites_tsv_path desired_output_path tsv_conf_file_path mapping_types
			
			-> mapping_types : 1 = exact multimapping
							   2 = chebi class mapping
							   3 = lipidmaps class mapping
							   4 = smiles class mapping
							   To use multiple mapping at once use commas, for example 1,2 for exact mapping and chebi mapping
							   Take care when using different class mappings at the same time (lipidmaps/chebi or smiles) as you can't compare their distances
							   Output consider results in this order of priority: Exact multimapping > chebi class mapping > lipidmaps mapping > smiles class mapping
							   
							   

========================================================================================	
Enrichment with lipidmaps and/or swisslipids for tsv files
========================================================================================
1/open the conf_tsv.txt file in the main directory to set the names of the columns in the metabolites file and the lipid file
	There is no need for every column to be present in your files
	In case some metabolites can have multiple of the same type of identifiers, you can also set the separator character (by default "|")
	
2/run the enrichment script:
	2.1 Place yourself in the work directory where the script is present using the cd command , note that you will have to specify the relative path to your files (metabolites, conf file and lipidmaps	file)

	2.2 type the following to run the scripts:
		
		For Lipidmaps enrichment:
		python enrichment_lipidmaps_tsv.py lipidmaps_path metabolites_tsv_path enriched_output_path tsv_conf_file_path
		
		For Swisslipids enrichment
		python enrichment_swisslipids_tsv.py swisslipids_path metabolites_tsv_path enriched_output_path tsv_conf_file_path
		
		If you want to perform both enrichment, run one script first then run the second using the result of the first one as input
		
		
		
========================================================================================	
Enrichment with lipidmaps and/or swisslipids for json files
========================================================================================
1/open the conf_tsv.txt file in the main directory to set the names of the columns in the metabolites file and the lipid file
	There is no need for every column to be present in your files
	In case some metabolites can have multiple of the same type of identifiers, you can also set the separator character (by default "|")
	
2/run the enrichment script:
	2.1 Place yourself in the work directory where the script is present using the cd command , note that you will have to specify the relative path to your files (metabolites, conf file and lipidmaps	file)

	2.2 type the following to run the scripts:
		
		For Lipidmaps enrichment:
		python enrichment_lipidmaps_json.py lipidmaps_path metabolites_json_path enriched_output_path json_conf_file_path
		
		For Swisslipids enrichment
		python enrichment_swisslipids_json.py swisslipids_path metabolites_json_path enriched_output_path json_conf_file_path
		
		If you want to perform both enrichment, run one script first then run the second using the result of the first one as input
		
		

========================================================================================	
Other scripts
========================================================================================

lmsf_add_smiles.py : uses lipidmaps webservices to add the smiles to the lpidmaps sdf file
	python lmsdf_add_smiles.py lipidmaps_sdf_path