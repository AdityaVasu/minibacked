async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({"inputs": "I like you. I love you"}).then((response) => {
	console.log(JSON.stringify(response));
});