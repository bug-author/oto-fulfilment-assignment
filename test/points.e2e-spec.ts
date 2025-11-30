import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { PointsModule } from "../src/points.module";

describe("Points Service (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PointsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true })
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should handle the example flow from the task", async () => {
    // add transactions
    await request(app.getHttpServer())
      .post("/add")
      .send({
        payer: "SHOPIFY",
        points: 1000,
        timestamp: "2024-07-02T14:00:00Z",
      })
      .expect(200);

    await request(app.getHttpServer())
      .post("/add")
      .send({ payer: "EBAY", points: 200, timestamp: "2024-06-30T11:00:00Z" })
      .expect(200);

    await request(app.getHttpServer())
      .post("/add")
      .send({
        payer: "SHOPIFY",
        points: -200,
        timestamp: "2024-06-30T15:00:00Z",
      })
      .expect(200);

    await request(app.getHttpServer())
      .post("/add")
      .send({
        payer: "AMAZON",
        points: 10000,
        timestamp: "2024-07-01T14:00:00Z",
      })
      .expect(200);

    await request(app.getHttpServer())
      .post("/add")
      .send({
        payer: "SHOPIFY",
        points: 300,
        timestamp: "2024-06-30T10:00:00Z",
      })
      .expect(200);

    // spend 5000 points
    const spendResponse = await request(app.getHttpServer())
      .post("/spend")
      .send({ points: 5000 })
      .expect(200);

    expect(spendResponse.body).toEqual(
      expect.arrayContaining([
        { payer: "SHOPIFY", points: -100 },
        { payer: "EBAY", points: -200 },
        { payer: "AMAZON", points: -4700 },
      ])
    );

    // check balances
    const balanceResponse = await request(app.getHttpServer())
      .get("/balance")
      .expect(200);

    expect(balanceResponse.body).toEqual({
      SHOPIFY: 1000,
      EBAY: 0,
      AMAZON: 5300,
    });
  });

  it("should return error when spending more than available", async () => {
    await request(app.getHttpServer())
      .post("/add")
      .send({ payer: "TEST", points: 100, timestamp: "2024-01-01T00:00:00Z" })
      .expect(200);

    await request(app.getHttpServer())
      .post("/spend")
      .send({ points: 500 })
      .expect(400);
  });
});
