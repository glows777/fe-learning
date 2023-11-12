declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    HOST: string
    USER_NAME: string
    PASSWORD: string
    DATABASE: string
    REDIS_PORT: string
  }
}
