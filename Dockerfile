FROM node:20-alpine AS builder

# Вставляем при билде, тк рантайм не поддерживается
ARG VITE_YNDX_API_KEY
ENV VITE_YNDX_API_KEY=${VITE_YNDX_API_KEY}

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
