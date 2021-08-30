# Latest artifact on master

Here is the content of a .sh file that would use the latest artifact url on master.

To use it, please create a batch file containing the following content:
```sh
mkdir ml-cli
echo '[]' > tasks.json
cd ml-cli
curl https://artprodsu6weu.artifacts.visualstudio.com/A8eadf117-5eb7-40c1-b8f1-aff749481679/895dba37-078c-4abd-b04e-b34978c90658/_apis/artifact/cGlwZWxpbmVhcnRpZmFjdDovL2F4YWd1aWxkZXYvcHJvamVjdElkLzg5NWRiYTM3LTA3OGMtNGFiZC1iMDRlLWIzNDk3OGM5MDY1OC9idWlsZElkLzQ4NTcvYXJ0aWZhY3ROYW1lL3VidW50dQ2/content?format=zip --output ml-cli.zip
unzip ml-cli.zip
unzip ubuntu/ml-cli-webapp/Ml.Cli.WebApp.zip
echo Installation done ! Launching Ml-Cli webapp...
./Ml.Cli.WebApp -s ./ -t ../tasks.json -b ./ -c ./ -d ./
```

Don't forget to use the command "chmod +x *Your file name*" to be able to execute your .sh file.
