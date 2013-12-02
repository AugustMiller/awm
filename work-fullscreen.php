<?
	/**
	 * Template Name: Fullscreen Gallery
	 * Description: Fullscreen project browser
	 *
	*/
?>
<? get_header(); ?>

<? $gallery = get_projects(); ?>
<? clog($gallery); ?>

<div class="instructions tablet-hide mobile-hide">
	<div class="keys"></div>
</div>

<div id="gallery" class="gallery-slides">

	<div id="minimap" class="minimap tablet-hide mobile-hide"></div>

	<div class="gallery-wrapper">

		<div class="project clearfix about" data-proj-name="About" data-page-id="0">

			<? $details = $gallery["about"][0]; ?>

			<? clog($details); ?>

			<div class="slide text arrow-right">
				<div class="slide-padding clearfix">
					<div class="column col-12 section">
						<h1>
							August W. Miller
						</h1>
					</div>
					<div class="column col-5 tablet-two-thirds section mantra">
						<p>
							<em><? echo $details["statement"]; ?></em>
						</p>
					</div>
					<div class="column col-5 tablet-two-thirds section bio clear">
						<p>
							<? echo $details["bio"]; ?>
						</p>
					</div>
					<? if ( $details["email"] && strpos( $details["email"] , "@" ) ) { ?>
						<div class="column col-5 tablet-two-thirds section clear">
							<p>
								All inquiries can be directed to <span id="email"></span>
							</p>
							<? $email = explode( "@" , $details["email"] ); ?>
							<script>
								var email = "<?= $email[0] ?>" + "@" + "<?= $email[1] ?>";
								$('#email').html( "<a href='mailto:" + email + "'>" + email + "</a>" );
							</script>
						</div>
					<? } ?>
				</div>
			</div>
			<div class="slide text arrow-down">
				<div class="slide-padding clearfix">
					<div class="column col-12 section">
						Details
					</div>
					<div class="column col-6 section">
						While August accepts freelance work, he has worked and interned full- or part-time for a number of awesome companies and studios.
					</div>
					<div class="section">
					<? foreach ( $details["experience"] as $job ) { ?><div class="column col-3 experience tablet-third">
							<h3 class="job-title"><a href="<?= $job["url"] ?>"><?= $job["location"] ?></a></h3>
							<h4 class="dates">
								<em><?= $job["dates"] ?></em>
							</h4>
							<p class="responsibilities">
								<?= $job["description"] ?>
							</p>
						</div><? } ?>
					</div>
				</div>
			</div>
		</div>

	<? foreach ( $gallery["projects"] as $project ) { ?>
		<?
			$fields = $project["fields"];
			$images = $fields["images"];
		?>
		<div class="project clearfix" data-proj-name="<?= $project["meta"]->post_title; ?>" data-page-id="<?= $project["meta"]->ID; ?>" data-page-permalink="<?= get_permalink($project["meta"]->ID); ?>">
			<div class="slide text arrow-right" <? /* if ( $project["fields"]["color"] ) { ?>style="background-color:<? echo $project["fields"]["color"]; ?>"<? } */ ?>>
				<div class="slide-padding clearfix">
					<div class="column col-12 section title">
						<h2>
							<? echo $project["fields"]["project_title"]; ?>
						</h2>
					</div>

					<? if ( $fields["project_highlight"] ) { ?>
						<div class="column col-5 section intro">
							<em><? echo $fields["project_highlight"]; ?></em>
						</div>
					<? } ?>

					<div class="column col-5 section description clear">
						<? echo $fields["project_brief"]; ?>
					</div>

					<div class="column col-1 section year">
						<? echo $fields["project_date"]; ?>
					</div>
				</div>
			</div>
			<? foreach ( $images as $image ) { ?>
				<? $sizes = $image["file"]["sizes"]; ?>
				<div class="slide">
					<div class="image">
						<img
							src=""
							data-src-large="<?= $image["file"]["url"] ?>"
							data-src-small="<?= $sizes["large"] ?>"
							data-src-mobile="<?= $sizes["work-tile-thumb"] ?>"
							data-width="<?= $image["file"]["width"] ?>"
							data-height="<?= $image["file"]["height"] ?>"
							alt="" />
					</div>
				</div>
			<? } ?>
		</div>
	<? } // Projects ?>

	</div>

</div>

<? get_footer(); ?>