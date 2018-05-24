This project utilizes a [Cloudant](https://www.ibm.com/cloud/cloudant) database server hosted on IBM cloud, however, these configurations and scripts are compatible with [CouchDB](http://couchdb.apache.org/), on which Cloudant is based. 

The scripts in this project define a view's map and reduce functions which give us the useful statistics we need from the collected data. A text index on the summaries database is specified by the given JSON file.
