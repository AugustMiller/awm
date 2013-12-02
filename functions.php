<?

/*
	Work Page Cacheing
*/

function get_projects ( ) {

	if ( $gallery = get_transient( 'gallery' ) ) {

		// clog("Query was cached.");

	} else {

		// clog("Using WP_Query");

		// $projects = new WP_Query( $params["projects"] );
		$choices = get_field('projects');
		$projects = array();

		foreach ( $choices as $choice ) {
			$projects[] = $choice["project"];
		}

		// clog($projects);

		$gallery = array(
			"projects" => array(),
			"about" => array()
		);

		foreach ( $projects as $project ) {
			$slide["meta"] = $project;
			$slide["fields"] = get_fields( $project->ID );
			array_push( $gallery["projects"] , $slide );
		}

		$about = get_fields( 86 );

		array_push( $gallery["about"] , $about );

		// Save it so you aint fuckin wif tha db too much
		set_transient( 'gallery' , $gallery , 0 );

	}

	return $gallery;
}

/*
	Delete Projects Transient on Post Save
*/

add_action( 'save_post' , 'scrub_projects' );


function scrub_projects ( ) {
	delete_transient( 'gallery' );
	get_projects();
}

/*
	Miscellaneous
*/

function clog ( $var ) {
	echo "<script>console.log(";
	print_r( json_encode( $var ) );
	echo ");</script>";
}
