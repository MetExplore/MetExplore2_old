#PARAMETERS--
# 1 -j job id as provided by MetExplore (it has to be a unique job id)
#--------------
#Get parameters
while getopts ":j:" option; do
    case "${option}" in
        j)
            jobNAME=${OPTARG}
            ;;
    esac
done
scancel --name=$jobNAME --quiet
