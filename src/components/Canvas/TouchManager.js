function referenceSafeRemove(array,index)
{
	for(var i = index;i<array.length;i++)
	{
		if(i < (array.length -1))
		{
			array[i] = array[i+1];
		}
	}
	array.pop();
}

export default class TouchManager {
	constructor()
	{
		this.touches = new Array();
		this.events = {};
		this.TOUCH_DELAY = 150;
		this.numTouches = 0;
		this.touchDownIssued = false;
		this.touchDownDistance = 0;
	}
	
	getTouchByID(id)
	{
		for(var i=0;i<this.touches.length;i++)
		{
			if(this.touches[i].id == id) return this.touches[i];
		}
		return false;
	}
	
	addEventListener(e,func)
	{
		this.events[e] = func;
	}
	
	getFingerDistance()
	{
		if(this.touches.length == 2)
		{
			var ta = this.touches[0];
			var tb = this.touches[1];
			return Math.sqrt((ta.x - tb.x)*(ta.x - tb.x) + (ta.y - tb.y)*(ta.y - tb.y));
		}
		else return 1;
	}
	
	touchstart(e)
	{
		if(this.touches.length == 0)
		{
			this.touchDownIssued = false;
			this.numTouches=0;
			this.touchDownDistance = 0;
			this.touchDownPosition = false;
		}
		
		for(var i=0;i<e.touches.length;i++)
		{
			var new_t = e.touches[i];
			var t = this.getTouchByID(new_t.identifier);
			if(!t)
			{
				this.touches.push(
				{
					id:new_t.identifier,
					x:new_t.pageX,
					y:new_t.pageY
				}
				);
			}
			else
			{
				t.x	= new_t.pageX;
				t.y = new_t.pageY;
			}
		}
		
		if(!this.touchDownIssued)
		{
			this.numTouches= Math.max(this.numTouches,this.touches.length);
		}
		
		//this.events["onTouchDown"](this.getCenterTouchPos(),this.touches);
	}
	
	touchmove(e)
	{
		for(var i=0;i<e.changedTouches.length;i++)
		{
			var new_t = e.changedTouches[i];
			
			var t = this.getTouchByID(new_t.identifier);
			//alert(t);
			t.x	= new_t.pageX;
			t.y = new_t.pageY;
		}
		
		var touchPos = this.getCenterTouchPos();
		
		if(!this.touchDownIssued)
		{
			if(this.events["onTouchDown"])
			this.events["onTouchDown"](touchPos,this.numTouches);
			this.touchDownIssued = true;
			this.touchDownDistance = this.getFingerDistance();
		}
		else
		{
			if(this.touches.length == 2 && this.touchDownDistance > 50)
			{
				var zoomDelta = this.getFingerDistance() / this.touchDownDistance;
				if(zoomDelta)
				{
					if(this.events["onTouchZoom"])
					this.events["onTouchZoom"](touchPos,zoomDelta);
				}
				this.touchDownDistance = this.getFingerDistance();
			}
			
			if(this.numTouches <= this.touches.length)
			{
				if(this.events["onTouchMove"])
				this.events["onTouchMove"](touchPos,this.numTouches);
			}
		}
	}
	
	touchend(e)
	{
		var touchPos = this.getCenterTouchPos();
		//var touchPos = this.touchDownPosition;
		for(var i=0;i<e.changedTouches.length;i++)
		{
			var new_t = e.changedTouches[i];
			var t = this.getTouchByID(new_t.identifier);
			referenceSafeRemove(this.touches,this.touches.indexOf(t));
		}
		
		//if(this.touches.length == 0)
		//{
		if(this.numTouches > 0)
		{
			if(!this.touchDownIssued)
			{
				if(this.events["onTouchDown"])
				this.events["onTouchDown"](touchPos,this.numTouches);
				this.touchDownIssued = true;
			}
			
			if(this.events["onTouchUp"])
			this.events["onTouchUp"](touchPos,this.numTouches);
			this.numTouches=0;
		}
			
	}
	
	touchcancel(e)
	{
		this.touchend(e);
	}
	
	touchleave(e)
	{
		this.touchend(e);
	}
	
	getCenterTouchPos()
	{
		var p = {x:0,y:0};
		for(var i=0;i<this.touches.length;i++)
		{
			p.x += this.touches[i].x;
			p.y += this.touches[i].y;
		}
		
		p.x /= this.touches.length;
		p.y /= this.touches.length;
		return p;
	}
}