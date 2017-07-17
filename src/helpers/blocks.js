export function sortBlocks(blocks) {
    return blocks.sort((a, b) => {
	if (a.z > b.z) {
	    return 1;
	} else if (a.z < b.z) {
	    return -1;
	}

	if (a.x > b.x) {
	    return -1;
	} else if (a.x < b.x) {
	    return 1;
	}

	if (a.y > b.y) {
	    return -1;
	} else if (a.y < b.y) {
	    return 1;
	}

	return 0;
    });
}

export function rotateBlock (b, rotational, width = 1) {
    let x = b.x;
    let y = b.y;
    switch (rotational) {
    case -1:
	x = b.x;
	y = b.y;
	break;
    case -2:
	x = b.y;
	y = width - 1 - b.x;
	break;
    case 1:
	x = width - 1 - b.y;
	y = b.x;
	break;
    case 2:
	x = width - 1 - b.x;
	y = width - 1 - b.y;
	break;
    default:
    }
    return { ...b, x: x, y: y };
}
