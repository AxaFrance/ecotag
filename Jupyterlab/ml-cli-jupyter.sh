mkdir ml-cli
echo '[]' > tasks.json
cd ml-cli
curl $1 --output ml-cli.zip
unzip ml-cli.zip
unzip ubuntu/ml-cli-webapp/Ml.Cli.WebApp.zip
echo Installation done ! Launching Ml-Cli webapp...
./Ml.Cli.WebApp -s ./ -t ../tasks.json -b ./ -c ./ -d ./
