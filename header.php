<!DOCTYPE html>

<html>
	<head>
		<title><? bloginfo("name"); ?></title>

		<meta name="description" content="<?php bloginfo( 'description' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" type="text/css" media="all" href="<?php echo get_stylesheet_directory_uri(); ?>/stylesheets/awm.css" />
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/jq.easy.js"></script>

		<?php wp_head(); ?>
	</head>

	<body>
		<div id="page">
			<header id="navigation">
				<img src="<?php echo get_template_directory_uri(); ?>/images/awm.svg" id="logo" onclick="Gallery.seek(0,0);" />
			</header>

			<div id="main">