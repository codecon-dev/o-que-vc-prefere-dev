# 1. Use uma imagem leve do Nginx como base
FROM nginx:alpine

# 2. Copie o arquivo index.html local para dentro do container
COPY index.html /usr/share/nginx/html/index.html

# 3. Exponha a porta 80 (padrão do Nginx)
EXPOSE 80
