const express = require("express");
import { Request, Response } from "express";

const server = new express();

server.get("/", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(200).send(
		"HI MY NAME IS DORA !! -- du du dora, dudu dora, du du dora "
	);
});
interface person {
	profile: {
		name: string;
		age: number;
	};
	place: {
		city: string;
		pincode: number;
	};
}

server.get("/explore", (req: Request, res: Response) => {
	console.log(req.url);

	let data: person = {
		profile: {
			name: "bhuji",
			age: 57,
		},
		place: {
			city: "mexico",
			pincode: 789456,
		},
	};

	res.status(200).send(data);
});

server.listen(3000, () => {
	console.log("server is running on port 3000");
});
