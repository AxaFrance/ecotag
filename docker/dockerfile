FROM mcr.microsoft.com/mssql/server
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Your_password123
COPY ./ /
ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]