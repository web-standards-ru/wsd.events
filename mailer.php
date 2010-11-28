<?php
	if ( isset( $_POST['submit'] )) {

		$name = $_POST['name'];
		$surname = $_POST['surname'];
		$email = $_POST['email'];
		$spec = $_POST['spec'];

		$to = 'wst@web-standards.ru';
		$subject = '[вст] Регистрация';
		$headers .= 'Content-Type: text/html; charset = "utf-8"';
	
$body = "<html>
	<body>
		<p>$name $surname</p>
		<p>$email</p>
		<p>$spec</p>
	</body>
</html>";

		mail($to, $subject, $body, $headers);
		header('Location: /done.htm');
	
	} else {

		header('Location: /error.htm');

	}
	
	// <form action="/mailer.php" method="post" class="register">
	// 	<fieldset>
	// 		<label for="reg-name">Имя •</label>
	// 		<input type="text" name="name" required id="reg-name">
	// 		<label for="reg-surname">Фамилия •</label>
	// 		<input type="text" name="surname" required id="reg-surname">
	// 		<label for="reg-email">E-mail •</label>
	// 		<input type="email" name="email" required id="reg-email">
	// 		<label for="reg-spec">Специализация</label>
	// 		<input type="text" name="spec" id="reg-spec">
	// 		<p class="note">• Поля, обязательные для заполнения.</p>
	// 		<input type="submit" name="submit" value="Зарегистрироваться">
	// 	</fieldset>
	// </form>

?>