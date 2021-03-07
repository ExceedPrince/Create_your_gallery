function pageLoad () {
	let root = document.getElementById("root");

	root.insertAdjacentHTML("afterbegin", `
		<h1>The Million Dollar Homepage</h1>
		<label for="file">Feltöltés itt:</label>
		<input type="file" id="input-file">
		<div id="bigCon">
			<div id="dragdrop-pic">
				<span>Húzd ide a képet</span>
				<input type="file" id="ddInput">
			</div>
			<div id="preview-pic">
			</div>
		</div>
		<div id="gallery"></div>
	`)

	function showBigPic(props) {

		let closeX = `<span id="closeBtn" class="close cursor">x</span>`;
	
		root.insertAdjacentHTML("beforeend", `
		<div id="myModal" class="modal" style="display: flex;">
			<div class="modal-content">
				<div class="inner">
					${closeX}
						<img id="modalPic" src="${props}">
				</div>
			</div>
		</div>`)
	
		closeModal();
	
	}
	
	function closeModal() {
		let closeX = Array.from(document.querySelectorAll("#closeBtn"));
		closeX.map(x => x.addEventListener("click", omg))
	}
	
	function omg() {
		let xxx = Array.from(document.querySelectorAll("#myModal"));
		xxx.map(x => x.style.display = "none")
	}
	//dragdrop-pic erre kell az ondrop és az ondragover

	const inputFile = document.getElementById("input-file"); 		// input type="file"
	const container = document.getElementById("dragdrop-pic");  // div, ahová be lehet húzni a képet
	const prevContainer = document.getElementById("preview-pic"); // div, aholmegjelenik a feltöltött kép
	const text = document.querySelector("span"); 								// sima töltelékszöveg
	const gallery = document.getElementById("gallery"); 				// ebben jelennek meg mozaikokkal a feltöltött képek
	const ddInput = document.getElementById("ddInput");					// ebben jelennek meg mozaikokkal a feltöltött képek

	let picArray = []; 																					// ebbe a tömbbe gyűlnek a feltöltöt képek

	inputFile.addEventListener("change", function () { 					// input gombnyomáskor lefutó függvény
		
		prevContainer.innerHTML = "";															// ezzel előbb lenullázzuk a befoglaló div tartalmát
		prevContainer.insertAdjacentHTML("afterbegin", `
			<img id="show-pic">					
		`);																												// újabban ezzel adjuk hozzá a folyton változó képet a div-hez
		const showPic = document.getElementById("show-pic");			// img, ami változtatja a source-át a gombos feltöltések alapján

		showPic.addEventListener("click", ()=>{showBigPic(showPic.src)});

		const file = this.files[0];																// 'this' ebben az esetben az input, ami kap egy 'files' array-t

		if (file) {																								// ha történik fájlkiválasztás. akkor...
			const reader = new FileReader();												// dataURL-ként fogja értelmezni a 'file'-t

			showPic.style.display = "block";

			reader.addEventListener("load", function() {						
				//console.log(this);
				showPic.setAttribute("src", this.result);							// az img kap egy src-t, ami: 'this' a 'FileReader', aminek automatikusan van 'result' property-je

				picArray.push({																				// a tömb végéhez adunk hozzá újabb elemet
					source: this.result,																// 'source' a kulcs, 'this.result' a 'FileReader' 'result" property-je
				});

				for (pic of picArray){																// pic-el végig megyünk a tömbön
					var arr = picArray.slice(-1).pop();									// a tömbből kiválasztja az utolsó elemet (ami itt egy objektum)
				};
				gallery.insertAdjacentHTML("beforeend", `
						<img src="${arr.source}" id="mozaikPic">					
					`);
			});																											// az utolsó elem 'source' kulcsának értékét tesszük be az src-be
			
			reader.readAsDataURL(file);															// ez segít a kiolvasott dataURL-t a kép src-jeként felhasználni ???
		} else {																									// ha nem történik fájlkiválasztás, akkor...
			text.style.display = null;
			showPic.style.display = null;
			showPic.setAttribute("src", "");												// az img kap egy src-t, ami egy üres string
		}

	});

	

	ddInput.addEventListener("change", function (event) {				// drag and drop függvény egy láthatatlan input type="file"-ra
		let fileName = URL.createObjectURL(event.target.files[0]); // változó, ami a behúzott fájlnak generált URL-jét hordozza
		prevContainer.innerHTML = "";															// ezzel előbb lenullázzuk a befoglaló div tartalmát

		prevContainer.insertAdjacentHTML("afterbegin", `
			<img src="${fileName}" id="show-dd-pic">					
		`);																												// újabban ezzel adjuk hozzá a folyton változó képet a div-hez
		document.getElementById("show-dd-pic").addEventListener("click", ()=>{showBigPic(document.getElementById("show-dd-pic").src)});

		picArray.push({																						// a tömb végéhez adunk hozzá újabb elemet
			source: fileName,																				// 'source' a kulcs, 'fileName' az URL
		});

		for (pic of picArray){																		// pic-el végig megyünk a tömbön
			var arrNew = picArray.slice(-1).pop();									// a tömbből kiválasztja az utolsó elemet (ami itt egy objektum)
		};
		gallery.insertAdjacentHTML("beforeend", `
				<img src="${arrNew.source}" id="mozaikPic">					
			`);																											// az utolsó elem 'source' kulcsának értékét tesszük be az src-be

	});

}

window.addEventListener("load", pageLoad);