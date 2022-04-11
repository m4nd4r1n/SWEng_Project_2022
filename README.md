# 2022 SW Engineering Project

## Requirement

1. [Node.js](https://nodejs.org/ko/) (v16.14 LTS)
2. [Yarn](https://yarnpkg.com/)
3. [PlanetScale CLI](https://github.com/planetscale/cli#installation)

> VSCode Extension (선택)
>
> - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
> - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

## 실행 방법

1. `pscale auth login`으로 PlanetScale 로그인
2. `pscale database create <DB이름> --region ap-northeast`으로 DB생성
3. `pscale connect <DB이름>`으로 DB 연결
   > MySQL이 실행 중인 경우 port 충돌이 발생하므로 `--port <3306을 제외한 포트>` 추가
4. `.env` 파일에 `DATABASE_URL="mysql://127.0.0.1:<포트>"`, `SESSION_PASSWORD=<32자리 이상의 문자열>` 추가
5. 프로젝트 폴더에서 `yarn install` 실행
6. 이후 `npx prisma db push` 실행
7. `yarn dev` 입력 후 [http://localhost:3000](http://localhost:3000) 접속

> - 개발 서버 실행 전 꼭 DB 먼저 연결 필수
> - DB 스키마 변경 후 `npx prisma db push` 진행 시 개발서버 재시작 필수

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
