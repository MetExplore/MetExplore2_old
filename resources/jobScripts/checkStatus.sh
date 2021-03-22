#PARAMETERS--
# 1 -j job id as provided by MetExplore (it has to be a unique job id)
#--------------
#Get parameters
while getopts ":j:d:" option; do
    case "${option}" in
        j)
            jobNAME=${OPTARG}
            ;;
        d)
            directory=${OPTARG}
            ;;
    esac
done

cp /work/project/metexplore/jobs/$jobNAME/results.json $directory/
cp /work/project/metexplore/jobs/$jobNAME/log $directory/

commandLine="sacct --name=$jobNAME --format=State"
result=$($commandLine)

status=$(echo $result | tail -1 | cut -d " " -f 3)
echo $status > $directory/status.txt
echo $status

#---BF BOOT_FAIL
#Job terminated due to launch failure, typically due to a hardware failure (e.g. unable to boot the node or block and the job can not be requeued).
#---CA CANCELLED
#Job was explicitly cancelled by the user or system administrator. The job may or may not have been initiated.
#---CD COMPLETED
#Job has terminated all processes on all nodes with an exit code of zero.
#---DL DEADLINE
#Job terminated on deadline.
#---F FAILED
#Job terminated with non-zero exit code or other failure condition.
#---NF NODE_FAIL
#Job terminated due to failure of one or more allocated nodes.
#---OOM OUT_OF_MEMORY
#Job experienced out of memory error.
#---PD PENDING
#Job is awaiting resource allocation.
#---PR PREEMPTED
#Job terminated due to preemption.
#---R RUNNING
#Job currently has an allocation.
#---RQ REQUEUED
#Job was requeued.
#---RS RESIZING
#Job is about to change size.
#---RV REVOKED
#Sibling was removed from cluster due to other cluster starting the job.
#---S SUSPENDED
#Job has an allocation, but execution has been suspended and CPUs have been released for other jobs.
#---TO TIMEOUT
#Job terminated upon reaching its time limit.