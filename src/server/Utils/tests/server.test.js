const superTest = require("supertest");
const { app, server } = require("../../server");
const { databaseRooms, databaseUsers } = require("../js/userHandeler/users");
const { resetDB } = require("../js/controllers/resetDB");
const { fetchEndPoints } = require("./helpers/indexHelp");

const api = superTest(app);

beforeAll(() => {
  resetDB();
});

describe("testing endPoints", () => {
  test("main endPoint", async () => {
    await api.get("/").expect(200);
  });

  test("/join endPoint", async () => {
    await api.get("/join").expect(302);
  });

  test("wrong endPoint", async () => {
    await api.get("/lol").expect(404);
  });

  test("create a room at /join", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: "p",
      createRoomCode: "p",
    });

    expect(fetchCreate).toBe("Room Created");
  });

  test("find Room created at the dataBase with _id = 'pp' ", () => {
    let idRoom;
    let idUsers;

    databaseRooms.find({ _id: "pp" }, (err, docs) => {
      idRoom = docs[0]._id;
      expect(idRoom).toBe("pp");
    });

    databaseUsers.find({ _id: "pp" }, (err, docs) => {
      idUsers = docs[0]._id;
      expect(idUsers).toBe("pp");
    });
  });

  test("join a Room at /join", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: "p",
      joinRoomCode: "p",
    });
    expect(fetchJoin).toBe("Room Found");
  });

  test("trying to create a Room that already has been created at /join", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: "p",
      createRoomCode: "p",
    });

    expect(fetchCreate).toBe("Room Already Created");
  });

  test("join a Room at /join with some unwanted characters", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: "  p@",
      joinRoomCode: "p  %",
    });
    expect(fetchJoin).toBe("Room Found");
  });

  test("Trying to join a Room that doesn't exist", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: "L",
      joinRoomCode: "L",
    });

    expect(fetchJoin).toBe("No Room Found");
  });

  test("empty String trying to create a Room", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: "",
      createRoomCode: "",
    });

    expect(fetchCreate).toBe("No data");
  });

  test("empty String trying to join a Room", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: "",
      joinRoomCode: "",
    });

    expect(fetchJoin).toBe("No data");
  });

  test("null trying to create a Room", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: null,
      createRoomCode: null,
    });

    expect(fetchCreate).toBe("No data");
  });

  test("null trying to join a Room", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: null,
      joinRoomCode: null,
    });

    expect(fetchJoin).toBe("No data");
  });

  test("undefined trying to create a Room", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: undefined,
      createRoomCode: undefined,
    });

    expect(fetchCreate).toBe("No data");
  });

  test("undefined trying to join a Room", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      joinRoomName: undefined,
      joinRoomCode: undefined,
    });

    expect(fetchJoin).toBe("No data");
  });

  test("wrong method trying to create a Room", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      joinRoomName: "lol",
      joinRoomCode: "lol",
    });

    expect(fetchCreate).toBe("No data");
  });

  test("wrong method trying to join a Room", async () => {
    const fetchJoin = await fetchEndPoints({
      btnGender: "join",
      createRoomName: "lol",
      createRoomCode: "lol",
    });

    expect(fetchJoin).toBe("No data");
  });

  test("first Room created with the same _id, should pass", async () => {
    const fetchCreate = await fetchEndPoints({
      btnGender: "create",
      createRoomName: "F",
      createRoomCode: "F",
    });

    expect(fetchCreate).toBe("Room Created");
  });

  test("second Room created with the same _id, shouldn't pass", async () => {
    const fetchCreateTwo = await fetchEndPoints({
      btnGender: "create",
      createRoomName: "F",
      createRoomCode: "F",
    });

    expect(fetchCreateTwo).toBe("Room Already Created");
  });
});

afterAll(() => {
  server.close();
});
