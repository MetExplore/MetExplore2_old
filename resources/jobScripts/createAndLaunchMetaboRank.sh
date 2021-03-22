#PARAMETERS--
# 1 -j job id as provided by MetExplore (it has to be a unique job id)
# 2 -c command line
# 3 -a AtomMapping folder
# 4 -m JAVA libraries folder
# 5 -r fichier de résultats dans /var/www/tmp
#--------------
echo '1-----Create script'
#Get parameters
while getopts ":j:c:r:a:m:" option; do
    case "${option}" in
        j)
            jobID=${OPTARG}
            ;;
        c)
            commandLine=${OPTARG}
            ;;
        r)
            resultsFolder=${OPTARG}
            ;;
        a)
            aamdir=${OPTARG}
            ;;
        m)
            metexploreJavaPath=${OPTARG}
            ;;
    esac
done

cd /work/project/metexplore/jobs
rm -fr $jobID
mkdir /work/project/metexplore/jobs/$jobID

#Create the scriptfile with slurm parameters
scriptFile="/work/project/metexplore/jobs/$jobID/script$jobID.sub"
echo "#!/bin/bash
#SBATCH -J $jobID
#SBATCH -p workq
#SBATCH -o ./results.json
#SBATCH -e ./log
#SBATCH -N 2" > $scriptFile

cd /work/project/metexplore/jobs/$jobID

cp $metexploreJavaPath/met4j-binding.jar /work/project/metexplore/jobs/$jobID/
cp $resultsFolder/*.* /work/project/metexplore/jobs/$jobID/
cp -r $aamdir/* /work/project/metexplore/jobs/$jobID/

#Add command line to script file
#Example: java -cp ./met4j-binding.jar fr.inra.toulouse.metexplore.Bind2DRank -network ./recon.txt -edgeWeights ./recon-AAM-weights.tab -metabolites ./testSeedReconRun.tab
echo "$commandLine" >> $scriptFile

echo '2----- launch script'
#launch the script on the server using slurm
sbatch "$scriptFile"
#echo 'script launched on genotoul server'
