(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;

      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }

      return ar;
    }

    function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

      return to;
    }

    var STATE_DELIMITER = '.';
    var EMPTY_ACTIVITY_MAP = {};
    var DEFAULT_GUARD_TYPE = 'xstate.guard';
    var TARGETLESS_KEY = '';

    function keys(value) {
      return Object.keys(value);
    }

    function matchesState(parentStateId, childStateId, delimiter) {
      if (delimiter === void 0) {
        delimiter = STATE_DELIMITER;
      }

      var parentStateValue = toStateValue(parentStateId, delimiter);
      var childStateValue = toStateValue(childStateId, delimiter);

      if (isString(childStateValue)) {
        if (isString(parentStateValue)) {
          return childStateValue === parentStateValue;
        } // Parent more specific than child


        return false;
      }

      if (isString(parentStateValue)) {
        return parentStateValue in childStateValue;
      }

      return keys(parentStateValue).every(function (key) {
        if (!(key in childStateValue)) {
          return false;
        }

        return matchesState(parentStateValue[key], childStateValue[key]);
      });
    }

    function getEventType(event) {
      try {
        return isString(event) || typeof event === 'number' ? "" + event : event.type;
      } catch (e) {
        throw new Error('Events must be strings or objects with a string event.type property.');
      }
    }

    function toStatePath(stateId, delimiter) {
      try {
        if (isArray(stateId)) {
          return stateId;
        }

        return stateId.toString().split(delimiter);
      } catch (e) {
        throw new Error("'" + stateId + "' is not a valid state path.");
      }
    }

    function isStateLike(state) {
      return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
    }

    function toStateValue(stateValue, delimiter) {
      if (isStateLike(stateValue)) {
        return stateValue.value;
      }

      if (isArray(stateValue)) {
        return pathToStateValue(stateValue);
      }

      if (typeof stateValue !== 'string') {
        return stateValue;
      }

      var statePath = toStatePath(stateValue, delimiter);
      return pathToStateValue(statePath);
    }

    function pathToStateValue(statePath) {
      if (statePath.length === 1) {
        return statePath[0];
      }

      var value = {};
      var marker = value;

      for (var i = 0; i < statePath.length - 1; i++) {
        if (i === statePath.length - 2) {
          marker[statePath[i]] = statePath[i + 1];
        } else {
          marker[statePath[i]] = {};
          marker = marker[statePath[i]];
        }
      }

      return value;
    }

    function mapValues(collection, iteratee) {
      var result = {};
      var collectionKeys = keys(collection);

      for (var i = 0; i < collectionKeys.length; i++) {
        var key = collectionKeys[i];
        result[key] = iteratee(collection[key], key, collection, i);
      }

      return result;
    }

    function mapFilterValues(collection, iteratee, predicate) {
      var e_1, _a;

      var result = {};

      try {
        for (var _b = __values(keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var item = collection[key];

          if (!predicate(item)) {
            continue;
          }

          result[key] = iteratee(item, key, collection);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      return result;
    }
    /**
     * Retrieves a value at the given path.
     * @param props The deep path to the prop of the desired value
     */


    var path = function (props) {
      return function (object) {
        var e_2, _a;

        var result = object;

        try {
          for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
            var prop = props_1_1.value;
            result = result[prop];
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }

        return result;
      };
    };
    /**
     * Retrieves a value at the given path via the nested accessor prop.
     * @param props The deep path to the prop of the desired value
     */


    function nestedPath(props, accessorProp) {
      return function (object) {
        var e_3, _a;

        var result = object;

        try {
          for (var props_2 = __values(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
            var prop = props_2_1.value;
            result = result[accessorProp][prop];
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
          } finally {
            if (e_3) throw e_3.error;
          }
        }

        return result;
      };
    }

    function toStatePaths(stateValue) {
      if (!stateValue) {
        return [[]];
      }

      if (isString(stateValue)) {
        return [[stateValue]];
      }

      var result = flatten(keys(stateValue).map(function (key) {
        var subStateValue = stateValue[key];

        if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
          return [[key]];
        }

        return toStatePaths(stateValue[key]).map(function (subPath) {
          return [key].concat(subPath);
        });
      }));
      return result;
    }

    function flatten(array) {
      var _a;

      return (_a = []).concat.apply(_a, __spreadArray([], __read(array)));
    }

    function toArrayStrict(value) {
      if (isArray(value)) {
        return value;
      }

      return [value];
    }

    function toArray(value) {
      if (value === undefined) {
        return [];
      }

      return toArrayStrict(value);
    }

    function mapContext(mapper, context, _event) {
      var e_5, _a;

      if (isFunction(mapper)) {
        return mapper(context, _event.data);
      }

      var result = {};

      try {
        for (var _b = __values(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var subMapper = mapper[key];

          if (isFunction(subMapper)) {
            result[key] = subMapper(context, _event.data);
          } else {
            result[key] = subMapper;
          }
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      return result;
    }

    function isBuiltInEvent(eventType) {
      return /^(done|error)\./.test(eventType);
    }

    function isPromiseLike(value) {
      if (value instanceof Promise) {
        return true;
      } // Check if shape matches the Promise/A+ specification for a "thenable".


      if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
        return true;
      }

      return false;
    }

    function partition(items, predicate) {
      var e_6, _a;

      var _b = __read([[], []], 2),
          truthy = _b[0],
          falsy = _b[1];

      try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
          var item = items_1_1.value;

          if (predicate(item)) {
            truthy.push(item);
          } else {
            falsy.push(item);
          }
        }
      } catch (e_6_1) {
        e_6 = {
          error: e_6_1
        };
      } finally {
        try {
          if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        } finally {
          if (e_6) throw e_6.error;
        }
      }

      return [truthy, falsy];
    }

    function updateHistoryStates(hist, stateValue) {
      return mapValues(hist.states, function (subHist, key) {
        if (!subHist) {
          return undefined;
        }

        var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

        if (!subStateValue) {
          return undefined;
        }

        return {
          current: subStateValue,
          states: updateHistoryStates(subHist, subStateValue)
        };
      });
    }

    function updateHistoryValue(hist, stateValue) {
      return {
        current: stateValue,
        states: updateHistoryStates(hist, stateValue)
      };
    }

    function updateContext(context, _event, assignActions, state) {

      var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
        var e_7, _a;

        var assignment = assignAction.assignment;
        var meta = {
          state: state,
          action: assignAction,
          _event: _event
        };
        var partialUpdate = {};

        if (isFunction(assignment)) {
          partialUpdate = assignment(acc, _event.data, meta);
        } else {
          try {
            for (var _b = __values(keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var key = _c.value;
              var propAssignment = assignment[key];
              partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
            }
          } catch (e_7_1) {
            e_7 = {
              error: e_7_1
            };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_7) throw e_7.error;
            }
          }
        }

        return Object.assign({}, acc, partialUpdate);
      }, context) : context;
      return updatedContext;
    } // tslint:disable-next-line:no-empty

    function isArray(value) {
      return Array.isArray(value);
    } // tslint:disable-next-line:ban-types


    function isFunction(value) {
      return typeof value === 'function';
    }

    function isString(value) {
      return typeof value === 'string';
    } // export function memoizedGetter<T, TP extends { prototype: object }>(
    //   o: TP,
    //   property: string,
    //   getter: () => T
    // ): void {
    //   Object.defineProperty(o.prototype, property, {
    //     get: getter,
    //     enumerable: false,
    //     configurable: false
    //   });
    // }


    function toGuard(condition, guardMap) {
      if (!condition) {
        return undefined;
      }

      if (isString(condition)) {
        return {
          type: DEFAULT_GUARD_TYPE,
          name: condition,
          predicate: guardMap ? guardMap[condition] : undefined
        };
      }

      if (isFunction(condition)) {
        return {
          type: DEFAULT_GUARD_TYPE,
          name: condition.name,
          predicate: condition
        };
      }

      return condition;
    }

    function isObservable(value) {
      try {
        return 'subscribe' in value && isFunction(value.subscribe);
      } catch (e) {
        return false;
      }
    }

    var symbolObservable = /*#__PURE__*/function () {
      return typeof Symbol === 'function' && Symbol.observable || '@@observable';
    }();

    function isMachine(value) {
      try {
        return '__xstatenode' in value;
      } catch (e) {
        return false;
      }
    }

    function isActor(value) {
      return !!value && typeof value.send === 'function';
    }

    function toEventObject(event, payload // id?: TEvent['type']
    ) {
      if (isString(event) || typeof event === 'number') {
        return __assign({
          type: event
        }, payload);
      }

      return event;
    }

    function toSCXMLEvent(event, scxmlEvent) {
      if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
        return event;
      }

      var eventObject = toEventObject(event);
      return __assign({
        name: eventObject.type,
        data: eventObject,
        $$type: 'scxml',
        type: 'external'
      }, scxmlEvent);
    }

    function toTransitionConfigArray(event, configLike) {
      var transitions = toArrayStrict(configLike).map(function (transitionLike) {
        if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
          return {
            target: transitionLike,
            event: event
          };
        }

        return __assign(__assign({}, transitionLike), {
          event: event
        });
      });
      return transitions;
    }

    function normalizeTarget(target) {
      if (target === undefined || target === TARGETLESS_KEY) {
        return undefined;
      }

      return toArray(target);
    }

    function evaluateGuard(machine, guard, context, _event, state) {
      var guards = machine.options.guards;
      var guardMeta = {
        state: state,
        cond: guard,
        _event: _event
      }; // TODO: do not hardcode!

      if (guard.type === DEFAULT_GUARD_TYPE) {
        return guard.predicate(context, _event.data, guardMeta);
      }

      var condFn = guards[guard.type];

      if (!condFn) {
        throw new Error("Guard '" + guard.type + "' is not implemented on machine '" + machine.id + "'.");
      }

      return condFn(context, _event.data, guardMeta);
    }

    function toInvokeSource(src) {
      if (typeof src === 'string') {
        return {
          type: src
        };
      }

      return src;
    }

    function toObserver(nextHandler, errorHandler, completionHandler) {
      if (typeof nextHandler === 'object') {
        return nextHandler;
      }

      var noop = function () {
        return void 0;
      };

      return {
        next: nextHandler,
        error: errorHandler || noop,
        complete: completionHandler || noop
      };
    }

    var ActionTypes;

    (function (ActionTypes) {
      ActionTypes["Start"] = "xstate.start";
      ActionTypes["Stop"] = "xstate.stop";
      ActionTypes["Raise"] = "xstate.raise";
      ActionTypes["Send"] = "xstate.send";
      ActionTypes["Cancel"] = "xstate.cancel";
      ActionTypes["NullEvent"] = "";
      ActionTypes["Assign"] = "xstate.assign";
      ActionTypes["After"] = "xstate.after";
      ActionTypes["DoneState"] = "done.state";
      ActionTypes["DoneInvoke"] = "done.invoke";
      ActionTypes["Log"] = "xstate.log";
      ActionTypes["Init"] = "xstate.init";
      ActionTypes["Invoke"] = "xstate.invoke";
      ActionTypes["ErrorExecution"] = "error.execution";
      ActionTypes["ErrorCommunication"] = "error.communication";
      ActionTypes["ErrorPlatform"] = "error.platform";
      ActionTypes["ErrorCustom"] = "xstate.error";
      ActionTypes["Update"] = "xstate.update";
      ActionTypes["Pure"] = "xstate.pure";
      ActionTypes["Choose"] = "xstate.choose";
    })(ActionTypes || (ActionTypes = {}));

    var SpecialTargets;

    (function (SpecialTargets) {
      SpecialTargets["Parent"] = "#_parent";
      SpecialTargets["Internal"] = "#_internal";
    })(SpecialTargets || (SpecialTargets = {}));

    var start = ActionTypes.Start;
    var stop = ActionTypes.Stop;
    var raise = ActionTypes.Raise;
    var send = ActionTypes.Send;
    var cancel = ActionTypes.Cancel;
    var nullEvent = ActionTypes.NullEvent;
    var assign = ActionTypes.Assign;
    var after = ActionTypes.After;
    var doneState = ActionTypes.DoneState;
    var log = ActionTypes.Log;
    var init = ActionTypes.Init;
    var invoke = ActionTypes.Invoke;
    var errorExecution = ActionTypes.ErrorExecution;
    var errorPlatform = ActionTypes.ErrorPlatform;
    var error = ActionTypes.ErrorCustom;
    var update = ActionTypes.Update;
    var choose = ActionTypes.Choose;
    var pure = ActionTypes.Pure;

    var initEvent = /*#__PURE__*/toSCXMLEvent({
      type: init
    });

    function getActionFunction(actionType, actionFunctionMap) {
      return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
    }

    function toActionObject(action, actionFunctionMap) {
      var actionObject;

      if (isString(action) || typeof action === 'number') {
        var exec = getActionFunction(action, actionFunctionMap);

        if (isFunction(exec)) {
          actionObject = {
            type: action,
            exec: exec
          };
        } else if (exec) {
          actionObject = exec;
        } else {
          actionObject = {
            type: action,
            exec: undefined
          };
        }
      } else if (isFunction(action)) {
        actionObject = {
          // Convert action to string if unnamed
          type: action.name || action.toString(),
          exec: action
        };
      } else {
        var exec = getActionFunction(action.type, actionFunctionMap);

        if (isFunction(exec)) {
          actionObject = __assign(__assign({}, action), {
            exec: exec
          });
        } else if (exec) {
          var actionType = exec.type || action.type;
          actionObject = __assign(__assign(__assign({}, exec), action), {
            type: actionType
          });
        } else {
          actionObject = action;
        }
      }

      Object.defineProperty(actionObject, 'toString', {
        value: function () {
          return actionObject.type;
        },
        enumerable: false,
        configurable: true
      });
      return actionObject;
    }

    var toActionObjects = function (action, actionFunctionMap) {
      if (!action) {
        return [];
      }

      var actions = isArray(action) ? action : [action];
      return actions.map(function (subAction) {
        return toActionObject(subAction, actionFunctionMap);
      });
    };

    function toActivityDefinition(action) {
      var actionObject = toActionObject(action);
      return __assign(__assign({
        id: isString(action) ? action : actionObject.id
      }, actionObject), {
        type: actionObject.type
      });
    }
    /**
     * Raises an event. This places the event in the internal event queue, so that
     * the event is immediately consumed by the machine in the current step.
     *
     * @param eventType The event to raise.
     */


    function raise$1(event) {
      if (!isString(event)) {
        return send$1(event, {
          to: SpecialTargets.Internal
        });
      }

      return {
        type: raise,
        event: event
      };
    }

    function resolveRaise(action) {
      return {
        type: raise,
        _event: toSCXMLEvent(action.event)
      };
    }
    /**
     * Sends an event. This returns an action that will be read by an interpreter to
     * send the event in the next step, after the current step is finished executing.
     *
     * @param event The event to send.
     * @param options Options to pass into the send event:
     *  - `id` - The unique send event identifier (used with `cancel()`).
     *  - `delay` - The number of milliseconds to delay the sending of the event.
     *  - `to` - The target of this event (by default, the machine the event was sent from).
     */


    function send$1(event, options) {
      return {
        to: options ? options.to : undefined,
        type: send,
        event: isFunction(event) ? event : toEventObject(event),
        delay: options ? options.delay : undefined,
        id: options && options.id !== undefined ? options.id : isFunction(event) ? event.name : getEventType(event)
      };
    }

    function resolveSend(action, ctx, _event, delaysMap) {
      var meta = {
        _event: _event
      }; // TODO: helper function for resolving Expr

      var resolvedEvent = toSCXMLEvent(isFunction(action.event) ? action.event(ctx, _event.data, meta) : action.event);
      var resolvedDelay;

      if (isString(action.delay)) {
        var configDelay = delaysMap && delaysMap[action.delay];
        resolvedDelay = isFunction(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
      } else {
        resolvedDelay = isFunction(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
      }

      var resolvedTarget = isFunction(action.to) ? action.to(ctx, _event.data, meta) : action.to;
      return __assign(__assign({}, action), {
        to: resolvedTarget,
        _event: resolvedEvent,
        event: resolvedEvent.data,
        delay: resolvedDelay
      });
    }

    var resolveLog = function (action, ctx, _event) {
      return __assign(__assign({}, action), {
        value: isString(action.expr) ? action.expr : action.expr(ctx, _event.data, {
          _event: _event
        })
      });
    };
    /**
     * Cancels an in-flight `send(...)` action. A canceled sent action will not
     * be executed, nor will its event be sent, unless it has already been sent
     * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
     *
     * @param sendId The `id` of the `send(...)` action to cancel.
     */


    var cancel$1 = function (sendId) {
      return {
        type: cancel,
        sendId: sendId
      };
    };
    /**
     * Starts an activity.
     *
     * @param activity The activity to start.
     */


    function start$1(activity) {
      var activityDef = toActivityDefinition(activity);
      return {
        type: ActionTypes.Start,
        activity: activityDef,
        exec: undefined
      };
    }
    /**
     * Stops an activity.
     *
     * @param actorRef The activity to stop.
     */


    function stop$1(actorRef) {
      var activity = isFunction(actorRef) ? actorRef : toActivityDefinition(actorRef);
      return {
        type: ActionTypes.Stop,
        activity: activity,
        exec: undefined
      };
    }

    function resolveStop(action, context, _event) {
      var actorRefOrString = isFunction(action.activity) ? action.activity(context, _event.data) : action.activity;
      var resolvedActorRef = typeof actorRefOrString === 'string' ? {
        id: actorRefOrString
      } : actorRefOrString;
      var actionObject = {
        type: ActionTypes.Stop,
        activity: resolvedActorRef
      };
      return actionObject;
    }
    /**
     * Returns an event type that represents an implicit event that
     * is sent after the specified `delay`.
     *
     * @param delayRef The delay in milliseconds
     * @param id The state node ID where this event is handled
     */


    function after$1(delayRef, id) {
      var idSuffix = id ? "#" + id : '';
      return ActionTypes.After + "(" + delayRef + ")" + idSuffix;
    }
    /**
     * Returns an event that represents that a final state node
     * has been reached in the parent state node.
     *
     * @param id The final state node's parent state node `id`
     * @param data The data to pass into the event
     */


    function done(id, data) {
      var type = ActionTypes.DoneState + "." + id;
      var eventObject = {
        type: type,
        data: data
      };

      eventObject.toString = function () {
        return type;
      };

      return eventObject;
    }
    /**
     * Returns an event that represents that an invoked service has terminated.
     *
     * An invoked service is terminated when it has reached a top-level final state node,
     * but not when it is canceled.
     *
     * @param id The final state node ID
     * @param data The data to pass into the event
     */


    function doneInvoke(id, data) {
      var type = ActionTypes.DoneInvoke + "." + id;
      var eventObject = {
        type: type,
        data: data
      };

      eventObject.toString = function () {
        return type;
      };

      return eventObject;
    }

    function error$1(id, data) {
      var type = ActionTypes.ErrorPlatform + "." + id;
      var eventObject = {
        type: type,
        data: data
      };

      eventObject.toString = function () {
        return type;
      };

      return eventObject;
    }

    function resolveActions(machine, currentState, currentContext, _event, actions) {
      var _a = __read(partition(actions, function (action) {
        return action.type === assign;
      }), 2),
          assignActions = _a[0],
          otherActions = _a[1];

      var updatedContext = assignActions.length ? updateContext(currentContext, _event, assignActions, currentState) : currentContext;
      var resolvedActions = flatten(otherActions.map(function (actionObject) {
        var _a;

        switch (actionObject.type) {
          case raise:
            return resolveRaise(actionObject);

          case send:
            var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

            return sendAction;

          case log:
            return resolveLog(actionObject, updatedContext, _event);

          case choose:
            {
              var chooseAction = actionObject;
              var matchedActions = (_a = chooseAction.conds.find(function (condition) {
                var guard = toGuard(condition.cond, machine.options.guards);
                return !guard || evaluateGuard(machine, guard, updatedContext, _event, currentState);
              })) === null || _a === void 0 ? void 0 : _a.actions;

              if (!matchedActions) {
                return [];
              }

              var resolved = resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray(matchedActions), machine.options.actions));
              updatedContext = resolved[1];
              return resolved[0];
            }

          case pure:
            {
              var matchedActions = actionObject.get(updatedContext, _event.data);

              if (!matchedActions) {
                return [];
              }

              var resolved = resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray(matchedActions), machine.options.actions));
              updatedContext = resolved[1];
              return resolved[0];
            }

          case stop:
            {
              return resolveStop(actionObject, updatedContext, _event);
            }

          default:
            return toActionObject(actionObject, machine.options.actions);
        }
      }));
      return [resolvedActions, updatedContext];
    }

    var isLeafNode = function (stateNode) {
      return stateNode.type === 'atomic' || stateNode.type === 'final';
    };

    function getChildren(stateNode) {
      return keys(stateNode.states).map(function (key) {
        return stateNode.states[key];
      });
    }

    function getAllStateNodes(stateNode) {
      var stateNodes = [stateNode];

      if (isLeafNode(stateNode)) {
        return stateNodes;
      }

      return stateNodes.concat(flatten(getChildren(stateNode).map(getAllStateNodes)));
    }

    function getConfiguration(prevStateNodes, stateNodes) {
      var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

      var prevConfiguration = new Set(prevStateNodes);
      var prevAdjList = getAdjList(prevConfiguration);
      var configuration = new Set(stateNodes);

      try {
        // add all ancestors
        for (var configuration_1 = __values(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
          var s = configuration_1_1.value;
          var m = s.parent;

          while (m && !configuration.has(m)) {
            configuration.add(m);
            m = m.parent;
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      var adjList = getAdjList(configuration);

      try {
        // add descendants
        for (var configuration_2 = __values(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
          var s = configuration_2_1.value; // if previously active, add existing child nodes

          if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
            if (prevAdjList.get(s)) {
              prevAdjList.get(s).forEach(function (sn) {
                return configuration.add(sn);
              });
            } else {
              s.initialStateNodes.forEach(function (sn) {
                return configuration.add(sn);
              });
            }
          } else {
            if (s.type === 'parallel') {
              try {
                for (var _e = (e_3 = void 0, __values(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var child = _f.value;

                  if (child.type === 'history') {
                    continue;
                  }

                  if (!configuration.has(child)) {
                    configuration.add(child);

                    if (prevAdjList.get(child)) {
                      prevAdjList.get(child).forEach(function (sn) {
                        return configuration.add(sn);
                      });
                    } else {
                      child.initialStateNodes.forEach(function (sn) {
                        return configuration.add(sn);
                      });
                    }
                  }
                }
              } catch (e_3_1) {
                e_3 = {
                  error: e_3_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
                } finally {
                  if (e_3) throw e_3.error;
                }
              }
            }
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      try {
        // add all ancestors
        for (var configuration_3 = __values(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
          var s = configuration_3_1.value;
          var m = s.parent;

          while (m && !configuration.has(m)) {
            configuration.add(m);
            m = m.parent;
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
        } finally {
          if (e_4) throw e_4.error;
        }
      }

      return configuration;
    }

    function getValueFromAdj(baseNode, adjList) {
      var childStateNodes = adjList.get(baseNode);

      if (!childStateNodes) {
        return {}; // todo: fix?
      }

      if (baseNode.type === 'compound') {
        var childStateNode = childStateNodes[0];

        if (childStateNode) {
          if (isLeafNode(childStateNode)) {
            return childStateNode.key;
          }
        } else {
          return {};
        }
      }

      var stateValue = {};
      childStateNodes.forEach(function (csn) {
        stateValue[csn.key] = getValueFromAdj(csn, adjList);
      });
      return stateValue;
    }

    function getAdjList(configuration) {
      var e_5, _a;

      var adjList = new Map();

      try {
        for (var configuration_4 = __values(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
          var s = configuration_4_1.value;

          if (!adjList.has(s)) {
            adjList.set(s, []);
          }

          if (s.parent) {
            if (!adjList.has(s.parent)) {
              adjList.set(s.parent, []);
            }

            adjList.get(s.parent).push(s);
          }
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      return adjList;
    }

    function getValue(rootNode, configuration) {
      var config = getConfiguration([rootNode], configuration);
      return getValueFromAdj(rootNode, getAdjList(config));
    }

    function has(iterable, item) {
      if (Array.isArray(iterable)) {
        return iterable.some(function (member) {
          return member === item;
        });
      }

      if (iterable instanceof Set) {
        return iterable.has(item);
      }

      return false; // TODO: fix
    }

    function nextEvents(configuration) {
      return __spreadArray([], __read(new Set(flatten(__spreadArray([], __read(configuration.map(function (sn) {
        return sn.ownEvents;
      })))))));
    }

    function isInFinalState(configuration, stateNode) {
      if (stateNode.type === 'compound') {
        return getChildren(stateNode).some(function (s) {
          return s.type === 'final' && has(configuration, s);
        });
      }

      if (stateNode.type === 'parallel') {
        return getChildren(stateNode).every(function (sn) {
          return isInFinalState(configuration, sn);
        });
      }

      return false;
    }

    function getMeta(configuration) {
      if (configuration === void 0) {
        configuration = [];
      }

      return configuration.reduce(function (acc, stateNode) {
        if (stateNode.meta !== undefined) {
          acc[stateNode.id] = stateNode.meta;
        }

        return acc;
      }, {});
    }

    function stateValuesEqual(a, b) {
      if (a === b) {
        return true;
      }

      if (a === undefined || b === undefined) {
        return false;
      }

      if (isString(a) || isString(b)) {
        return a === b;
      }

      var aKeys = keys(a);
      var bKeys = keys(b);
      return aKeys.length === bKeys.length && aKeys.every(function (key) {
        return stateValuesEqual(a[key], b[key]);
      });
    }

    function isState(state) {
      if (isString(state)) {
        return false;
      }

      return 'value' in state && 'history' in state;
    }

    function bindActionToState(action, state) {
      var exec = action.exec;

      var boundAction = __assign(__assign({}, action), {
        exec: exec !== undefined ? function () {
          return exec(state.context, state.event, {
            action: action,
            state: state,
            _event: state._event
          });
        } : undefined
      });

      return boundAction;
    }

    var State =
    /*#__PURE__*/

    /** @class */
    function () {
      /**
       * Creates a new State instance.
       * @param value The state value
       * @param context The extended state
       * @param historyValue The tree representing historical values of the state nodes
       * @param history The previous state
       * @param actions An array of action objects to execute as side-effects
       * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
       * @param meta
       * @param events Internal event queue. Should be empty with run-to-completion semantics.
       * @param configuration
       */
      function State(config) {
        var _this = this;

        var _a;

        this.actions = [];
        this.activities = EMPTY_ACTIVITY_MAP;
        this.meta = {};
        this.events = [];
        this.value = config.value;
        this.context = config.context;
        this._event = config._event;
        this._sessionid = config._sessionid;
        this.event = this._event.data;
        this.historyValue = config.historyValue;
        this.history = config.history;
        this.actions = config.actions || [];
        this.activities = config.activities || EMPTY_ACTIVITY_MAP;
        this.meta = getMeta(config.configuration);
        this.events = config.events || [];
        this.matches = this.matches.bind(this);
        this.toStrings = this.toStrings.bind(this);
        this.configuration = config.configuration;
        this.transitions = config.transitions;
        this.children = config.children;
        this.done = !!config.done;
        this.tags = (_a = config.tags) !== null && _a !== void 0 ? _a : new Set();
        Object.defineProperty(this, 'nextEvents', {
          get: function () {
            return nextEvents(_this.configuration);
          }
        });
      }
      /**
       * Creates a new State instance for the given `stateValue` and `context`.
       * @param stateValue
       * @param context
       */


      State.from = function (stateValue, context) {
        if (stateValue instanceof State) {
          if (stateValue.context !== context) {
            return new State({
              value: stateValue.value,
              context: context,
              _event: stateValue._event,
              _sessionid: null,
              historyValue: stateValue.historyValue,
              history: stateValue.history,
              actions: [],
              activities: stateValue.activities,
              meta: {},
              events: [],
              configuration: [],
              transitions: [],
              children: {}
            });
          }

          return stateValue;
        }

        var _event = initEvent;
        return new State({
          value: stateValue,
          context: context,
          _event: _event,
          _sessionid: null,
          historyValue: undefined,
          history: undefined,
          actions: [],
          activities: undefined,
          meta: undefined,
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      };
      /**
       * Creates a new State instance for the given `config`.
       * @param config The state config
       */


      State.create = function (config) {
        return new State(config);
      };
      /**
       * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
       * @param stateValue
       * @param context
       */


      State.inert = function (stateValue, context) {
        if (stateValue instanceof State) {
          if (!stateValue.actions.length) {
            return stateValue;
          }

          var _event = initEvent;
          return new State({
            value: stateValue.value,
            context: context,
            _event: _event,
            _sessionid: null,
            historyValue: stateValue.historyValue,
            history: stateValue.history,
            activities: stateValue.activities,
            configuration: stateValue.configuration,
            transitions: [],
            children: {}
          });
        }

        return State.from(stateValue, context);
      };
      /**
       * Returns an array of all the string leaf state node paths.
       * @param stateValue
       * @param delimiter The character(s) that separate each subpath in the string state node path.
       */


      State.prototype.toStrings = function (stateValue, delimiter) {
        var _this = this;

        if (stateValue === void 0) {
          stateValue = this.value;
        }

        if (delimiter === void 0) {
          delimiter = '.';
        }

        if (isString(stateValue)) {
          return [stateValue];
        }

        var valueKeys = keys(stateValue);
        return valueKeys.concat.apply(valueKeys, __spreadArray([], __read(valueKeys.map(function (key) {
          return _this.toStrings(stateValue[key], delimiter).map(function (s) {
            return key + delimiter + s;
          });
        }))));
      };

      State.prototype.toJSON = function () {
        var _a = this,
            configuration = _a.configuration,
            transitions = _a.transitions,
            tags = _a.tags,
            jsonValues = __rest(_a, ["configuration", "transitions", "tags"]);

        return __assign(__assign({}, jsonValues), {
          tags: Array.from(tags)
        });
      };
      /**
       * Whether the current state value is a subset of the given parent state value.
       * @param parentStateValue
       */


      State.prototype.matches = function (parentStateValue) {
        return matchesState(parentStateValue, this.value);
      };
      /**
       * Whether the current state configuration has a state node with the specified `tag`.
       * @param tag
       */


      State.prototype.hasTag = function (tag) {
        return this.tags.has(tag);
      };

      return State;
    }();

    /**
     * Maintains a stack of the current service in scope.
     * This is used to provide the correct service to spawn().
     */

    var provide = function (service, fn) {
      var result = fn(service);
      return result;
    };

    function createNullActor(id) {
      return {
        id: id,
        send: function () {
          return void 0;
        },
        subscribe: function () {
          return {
            unsubscribe: function () {
              return void 0;
            }
          };
        },
        getSnapshot: function () {
          return undefined;
        },
        toJSON: function () {
          return {
            id: id
          };
        }
      };
    }
    /**
     * Creates a deferred actor that is able to be invoked given the provided
     * invocation information in its `.meta` value.
     *
     * @param invokeDefinition The meta information needed to invoke the actor.
     */


    function createInvocableActor(invokeDefinition, machine, context, _event) {
      var _a;

      var invokeSrc = toInvokeSource(invokeDefinition.src);
      var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
      var resolvedData = invokeDefinition.data ? mapContext(invokeDefinition.data, context, _event) : undefined;
      var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

      tempActor.meta = invokeDefinition;
      return tempActor;
    }

    function createDeferredActor(entity, id, data) {
      var tempActor = createNullActor(id); // @ts-ignore

      tempActor.deferred = true;

      if (isMachine(entity)) {
        // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
        var initialState_1 = tempActor.state = provide(undefined, function () {
          return (data ? entity.withContext(data) : entity).initialState;
        });

        tempActor.getSnapshot = function () {
          return initialState_1;
        };
      }

      return tempActor;
    }

    function isActor$1(item) {
      try {
        return typeof item.send === 'function';
      } catch (e) {
        return false;
      }
    }

    function isSpawnedActor(item) {
      return isActor$1(item) && 'id' in item;
    }

    function toInvokeSource$1(src) {
      if (typeof src === 'string') {
        var simpleSrc = {
          type: src
        };

        simpleSrc.toString = function () {
          return src;
        }; // v4 compat - TODO: remove in v5


        return simpleSrc;
      }

      return src;
    }

    function toInvokeDefinition(invokeConfig) {
      return __assign(__assign({
        type: invoke
      }, invokeConfig), {
        toJSON: function () {
          var onDone = invokeConfig.onDone,
              onError = invokeConfig.onError,
              invokeDef = __rest(invokeConfig, ["onDone", "onError"]);

          return __assign(__assign({}, invokeDef), {
            type: invoke,
            src: toInvokeSource$1(invokeConfig.src)
          });
        }
      });
    }

    var NULL_EVENT = '';
    var STATE_IDENTIFIER = '#';
    var WILDCARD = '*';
    var EMPTY_OBJECT = {};

    var isStateId = function (str) {
      return str[0] === STATE_IDENTIFIER;
    };

    var createDefaultOptions = function () {
      return {
        actions: {},
        guards: {},
        services: {},
        activities: {},
        delays: {}
      };
    };

    var StateNode =
    /*#__PURE__*/

    /** @class */
    function () {
      function StateNode(
      /**
       * The raw config used to create the machine.
       */
      config, options,
      /**
       * The initial extended state
       */
      context // TODO: this is unsafe, but we're removing it in v5 anyway
      ) {
        var _this = this;

        if (context === void 0) {
          context = undefined;
        }

        var _a;

        this.config = config;
        this.context = context;
        /**
         * The order this state node appears. Corresponds to the implicit SCXML document order.
         */

        this.order = -1;
        this.__xstatenode = true;
        this.__cache = {
          events: undefined,
          relativeValue: new Map(),
          initialStateValue: undefined,
          initialState: undefined,
          on: undefined,
          transitions: undefined,
          candidates: {},
          delayedTransitions: undefined
        };
        this.idMap = {};
        this.tags = [];
        this.options = Object.assign(createDefaultOptions(), options);
        this.parent = this.options._parent;
        this.key = this.config.key || this.options._key || this.config.id || '(machine)';
        this.machine = this.parent ? this.parent.machine : this;
        this.path = this.parent ? this.parent.path.concat(this.key) : [];
        this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : STATE_DELIMITER);
        this.id = this.config.id || __spreadArray([this.machine.key], __read(this.path)).join(this.delimiter);
        this.version = this.parent ? this.parent.version : this.config.version;
        this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
        this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};

        this.initial = this.config.initial;
        this.states = this.config.states ? mapValues(this.config.states, function (stateConfig, key) {
          var _a;

          var stateNode = new StateNode(stateConfig, {
            _parent: _this,
            _key: key
          });
          Object.assign(_this.idMap, __assign((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
          return stateNode;
        }) : EMPTY_OBJECT; // Document order

        var order = 0;

        function dfs(stateNode) {
          var e_1, _a;

          stateNode.order = order++;

          try {
            for (var _b = __values(getChildren(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var child = _c.value;
              dfs(child);
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        dfs(this); // History config

        this.history = this.config.history === true ? 'shallow' : this.config.history || false;
        this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
          var event = _a.event;
          return event === NULL_EVENT;
        }) : NULL_EVENT in this.config.on);
        this.strict = !!this.config.strict; // TODO: deprecate (entry)

        this.onEntry = toArray(this.config.entry || this.config.onEntry).map(function (action) {
          return toActionObject(action);
        }); // TODO: deprecate (exit)

        this.onExit = toArray(this.config.exit || this.config.onExit).map(function (action) {
          return toActionObject(action);
        });
        this.meta = this.config.meta;
        this.doneData = this.type === 'final' ? this.config.data : undefined;
        this.invoke = toArray(this.config.invoke).map(function (invokeConfig, i) {
          var _a, _b;

          if (isMachine(invokeConfig)) {
            _this.machine.options.services = __assign((_a = {}, _a[invokeConfig.id] = invokeConfig, _a), _this.machine.options.services);
            return toInvokeDefinition({
              src: invokeConfig.id,
              id: invokeConfig.id
            });
          } else if (isString(invokeConfig.src)) {
            return toInvokeDefinition(__assign(__assign({}, invokeConfig), {
              id: invokeConfig.id || invokeConfig.src,
              src: invokeConfig.src
            }));
          } else if (isMachine(invokeConfig.src) || isFunction(invokeConfig.src)) {
            var invokeSrc = _this.id + ":invocation[" + i + "]"; // TODO: util function

            _this.machine.options.services = __assign((_b = {}, _b[invokeSrc] = invokeConfig.src, _b), _this.machine.options.services);
            return toInvokeDefinition(__assign(__assign({
              id: invokeSrc
            }, invokeConfig), {
              src: invokeSrc
            }));
          } else {
            var invokeSource = invokeConfig.src;
            return toInvokeDefinition(__assign(__assign({
              id: invokeSource.type
            }, invokeConfig), {
              src: invokeSource
            }));
          }
        });
        this.activities = toArray(this.config.activities).concat(this.invoke).map(function (activity) {
          return toActivityDefinition(activity);
        });
        this.transition = this.transition.bind(this);
        this.tags = toArray(this.config.tags); // TODO: this is the real fix for initialization once
        // state node getters are deprecated
        // if (!this.parent) {
        //   this._init();
        // }
      }

      StateNode.prototype._init = function () {
        if (this.__cache.transitions) {
          return;
        }

        getAllStateNodes(this).forEach(function (stateNode) {
          return stateNode.on;
        });
      };
      /**
       * Clones this state machine with custom options and context.
       *
       * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
       * @param context Custom context (will override predefined context)
       */


      StateNode.prototype.withConfig = function (options, context) {
        if (context === void 0) {
          context = this.context;
        }

        var _a = this.options,
            actions = _a.actions,
            activities = _a.activities,
            guards = _a.guards,
            services = _a.services,
            delays = _a.delays;
        return new StateNode(this.config, {
          actions: __assign(__assign({}, actions), options.actions),
          activities: __assign(__assign({}, activities), options.activities),
          guards: __assign(__assign({}, guards), options.guards),
          services: __assign(__assign({}, services), options.services),
          delays: __assign(__assign({}, delays), options.delays)
        }, context);
      };
      /**
       * Clones this state machine with custom context.
       *
       * @param context Custom context (will override predefined context, not recursive)
       */


      StateNode.prototype.withContext = function (context) {
        return new StateNode(this.config, this.options, context);
      };

      Object.defineProperty(StateNode.prototype, "definition", {
        /**
         * The well-structured state node definition.
         */
        get: function () {
          return {
            id: this.id,
            key: this.key,
            version: this.version,
            context: this.context,
            type: this.type,
            initial: this.initial,
            history: this.history,
            states: mapValues(this.states, function (state) {
              return state.definition;
            }),
            on: this.on,
            transitions: this.transitions,
            entry: this.onEntry,
            exit: this.onExit,
            activities: this.activities || [],
            meta: this.meta,
            order: this.order || -1,
            data: this.doneData,
            invoke: this.invoke
          };
        },
        enumerable: false,
        configurable: true
      });

      StateNode.prototype.toJSON = function () {
        return this.definition;
      };

      Object.defineProperty(StateNode.prototype, "on", {
        /**
         * The mapping of events to transitions.
         */
        get: function () {
          if (this.__cache.on) {
            return this.__cache.on;
          }

          var transitions = this.transitions;
          return this.__cache.on = transitions.reduce(function (map, transition) {
            map[transition.eventType] = map[transition.eventType] || [];
            map[transition.eventType].push(transition);
            return map;
          }, {});
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(StateNode.prototype, "after", {
        get: function () {
          return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(StateNode.prototype, "transitions", {
        /**
         * All the transitions that can be taken from this state node.
         */
        get: function () {
          return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
        },
        enumerable: false,
        configurable: true
      });

      StateNode.prototype.getCandidates = function (eventName) {
        if (this.__cache.candidates[eventName]) {
          return this.__cache.candidates[eventName];
        }

        var transient = eventName === NULL_EVENT;
        var candidates = this.transitions.filter(function (transition) {
          var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

          return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
        });
        this.__cache.candidates[eventName] = candidates;
        return candidates;
      };
      /**
       * All delayed transitions from the config.
       */


      StateNode.prototype.getDelayedTransitions = function () {
        var _this = this;

        var afterConfig = this.config.after;

        if (!afterConfig) {
          return [];
        }

        var mutateEntryExit = function (delay, i) {
          var delayRef = isFunction(delay) ? _this.id + ":delay[" + i + "]" : delay;
          var eventType = after$1(delayRef, _this.id);

          _this.onEntry.push(send$1(eventType, {
            delay: delay
          }));

          _this.onExit.push(cancel$1(eventType));

          return eventType;
        };

        var delayedTransitions = isArray(afterConfig) ? afterConfig.map(function (transition, i) {
          var eventType = mutateEntryExit(transition.delay, i);
          return __assign(__assign({}, transition), {
            event: eventType
          });
        }) : flatten(keys(afterConfig).map(function (delay, i) {
          var configTransition = afterConfig[delay];
          var resolvedTransition = isString(configTransition) ? {
            target: configTransition
          } : configTransition;
          var resolvedDelay = !isNaN(+delay) ? +delay : delay;
          var eventType = mutateEntryExit(resolvedDelay, i);
          return toArray(resolvedTransition).map(function (transition) {
            return __assign(__assign({}, transition), {
              event: eventType,
              delay: resolvedDelay
            });
          });
        }));
        return delayedTransitions.map(function (delayedTransition) {
          var delay = delayedTransition.delay;
          return __assign(__assign({}, _this.formatTransition(delayedTransition)), {
            delay: delay
          });
        });
      };
      /**
       * Returns the state nodes represented by the current state value.
       *
       * @param state The state value or State instance
       */


      StateNode.prototype.getStateNodes = function (state) {
        var _a;

        var _this = this;

        if (!state) {
          return [];
        }

        var stateValue = state instanceof State ? state.value : toStateValue(state, this.delimiter);

        if (isString(stateValue)) {
          var initialStateValue = this.getStateNode(stateValue).initial;
          return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
        }

        var subStateKeys = keys(stateValue);
        var subStateNodes = subStateKeys.map(function (subStateKey) {
          return _this.getStateNode(subStateKey);
        });
        subStateNodes.push(this);
        return subStateNodes.concat(subStateKeys.reduce(function (allSubStateNodes, subStateKey) {
          var subStateNode = _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);

          return allSubStateNodes.concat(subStateNode);
        }, []));
      };
      /**
       * Returns `true` if this state node explicitly handles the given event.
       *
       * @param event The event in question
       */


      StateNode.prototype.handles = function (event) {
        var eventType = getEventType(event);
        return this.events.includes(eventType);
      };
      /**
       * Resolves the given `state` to a new `State` instance relative to this machine.
       *
       * This ensures that `.events` and `.nextEvents` represent the correct values.
       *
       * @param state The state to resolve
       */


      StateNode.prototype.resolveState = function (state) {
        var configuration = Array.from(getConfiguration([], this.getStateNodes(state.value)));
        return new State(__assign(__assign({}, state), {
          value: this.resolve(state.value),
          configuration: configuration,
          done: isInFinalState(configuration, this)
        }));
      };

      StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
        var stateNode = this.getStateNode(stateValue);
        var next = stateNode.next(state, _event);

        if (!next || !next.transitions.length) {
          return this.next(state, _event);
        }

        return next;
      };

      StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
        var subStateKeys = keys(stateValue);
        var stateNode = this.getStateNode(subStateKeys[0]);

        var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

        if (!next || !next.transitions.length) {
          return this.next(state, _event);
        }

        return next;
      };

      StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
        var e_2, _a;

        var transitionMap = {};

        try {
          for (var _b = __values(keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var subStateKey = _c.value;
            var subStateValue = stateValue[subStateKey];

            if (!subStateValue) {
              continue;
            }

            var subStateNode = this.getStateNode(subStateKey);

            var next = subStateNode._transition(subStateValue, state, _event);

            if (next) {
              transitionMap[subStateKey] = next;
            }
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_2) throw e_2.error;
          }
        }

        var stateTransitions = keys(transitionMap).map(function (key) {
          return transitionMap[key];
        });
        var enabledTransitions = flatten(stateTransitions.map(function (st) {
          return st.transitions;
        }));
        var willTransition = stateTransitions.some(function (st) {
          return st.transitions.length > 0;
        });

        if (!willTransition) {
          return this.next(state, _event);
        }

        var entryNodes = flatten(stateTransitions.map(function (t) {
          return t.entrySet;
        }));
        var configuration = flatten(keys(transitionMap).map(function (key) {
          return transitionMap[key].configuration;
        }));
        return {
          transitions: enabledTransitions,
          entrySet: entryNodes,
          exitSet: flatten(stateTransitions.map(function (t) {
            return t.exitSet;
          })),
          configuration: configuration,
          source: state,
          actions: flatten(keys(transitionMap).map(function (key) {
            return transitionMap[key].actions;
          }))
        };
      };

      StateNode.prototype._transition = function (stateValue, state, _event) {
        // leaf node
        if (isString(stateValue)) {
          return this.transitionLeafNode(stateValue, state, _event);
        } // hierarchical node


        if (keys(stateValue).length === 1) {
          return this.transitionCompoundNode(stateValue, state, _event);
        } // orthogonal node


        return this.transitionParallelNode(stateValue, state, _event);
      };

      StateNode.prototype.next = function (state, _event) {
        var e_3, _a;

        var _this = this;

        var eventName = _event.name;
        var actions = [];
        var nextStateNodes = [];
        var selectedTransition;

        try {
          for (var _b = __values(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var candidate = _c.value;
            var cond = candidate.cond,
                stateIn = candidate.in;
            var resolvedContext = state.context;
            var isInState = stateIn ? isString(stateIn) && isStateId(stateIn) ? // Check if in state by ID
            state.matches(toStateValue(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
            matchesState(toStateValue(stateIn, this.delimiter), path(this.path.slice(0, -2))(state.value)) : true;
            var guardPassed = false;

            try {
              guardPassed = !cond || evaluateGuard(this.machine, cond, resolvedContext, _event, state);
            } catch (err) {
              throw new Error("Unable to evaluate guard '" + (cond.name || cond.type) + "' in transition for event '" + eventName + "' in state node '" + this.id + "':\n" + err.message);
            }

            if (guardPassed && isInState) {
              if (candidate.target !== undefined) {
                nextStateNodes = candidate.target;
              }

              actions.push.apply(actions, __spreadArray([], __read(candidate.actions)));
              selectedTransition = candidate;
              break;
            }
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_3) throw e_3.error;
          }
        }

        if (!selectedTransition) {
          return undefined;
        }

        if (!nextStateNodes.length) {
          return {
            transitions: [selectedTransition],
            entrySet: [],
            exitSet: [],
            configuration: state.value ? [this] : [],
            source: state,
            actions: actions
          };
        }

        var allNextStateNodes = flatten(nextStateNodes.map(function (stateNode) {
          return _this.getRelativeStateNodes(stateNode, state.historyValue);
        }));
        var isInternal = !!selectedTransition.internal;
        var reentryNodes = isInternal ? [] : flatten(allNextStateNodes.map(function (n) {
          return _this.nodesFromChild(n);
        }));
        return {
          transitions: [selectedTransition],
          entrySet: reentryNodes,
          exitSet: isInternal ? [] : [this],
          configuration: allNextStateNodes,
          source: state,
          actions: actions
        };
      };

      StateNode.prototype.nodesFromChild = function (childStateNode) {
        if (childStateNode.escapes(this)) {
          return [];
        }

        var nodes = [];
        var marker = childStateNode;

        while (marker && marker !== this) {
          nodes.push(marker);
          marker = marker.parent;
        }

        nodes.push(this); // inclusive

        return nodes;
      };
      /**
       * Whether the given state node "escapes" this state node. If the `stateNode` is equal to or the parent of
       * this state node, it does not escape.
       */


      StateNode.prototype.escapes = function (stateNode) {
        if (this === stateNode) {
          return false;
        }

        var parent = this.parent;

        while (parent) {
          if (parent === stateNode) {
            return false;
          }

          parent = parent.parent;
        }

        return true;
      };

      StateNode.prototype.getActions = function (transition, currentContext, _event, prevState) {
        var e_4, _a, e_5, _b;

        var prevConfig = getConfiguration([], prevState ? this.getStateNodes(prevState.value) : [this]);
        var resolvedConfig = transition.configuration.length ? getConfiguration(prevConfig, transition.configuration) : prevConfig;

        try {
          for (var resolvedConfig_1 = __values(resolvedConfig), resolvedConfig_1_1 = resolvedConfig_1.next(); !resolvedConfig_1_1.done; resolvedConfig_1_1 = resolvedConfig_1.next()) {
            var sn = resolvedConfig_1_1.value;

            if (!has(prevConfig, sn)) {
              transition.entrySet.push(sn);
            }
          }
        } catch (e_4_1) {
          e_4 = {
            error: e_4_1
          };
        } finally {
          try {
            if (resolvedConfig_1_1 && !resolvedConfig_1_1.done && (_a = resolvedConfig_1.return)) _a.call(resolvedConfig_1);
          } finally {
            if (e_4) throw e_4.error;
          }
        }

        try {
          for (var prevConfig_1 = __values(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
            var sn = prevConfig_1_1.value;

            if (!has(resolvedConfig, sn) || has(transition.exitSet, sn.parent)) {
              transition.exitSet.push(sn);
            }
          }
        } catch (e_5_1) {
          e_5 = {
            error: e_5_1
          };
        } finally {
          try {
            if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
          } finally {
            if (e_5) throw e_5.error;
          }
        }

        if (!transition.source) {
          transition.exitSet = []; // Ensure that root StateNode (machine) is entered

          transition.entrySet.push(this);
        }

        var doneEvents = flatten(transition.entrySet.map(function (sn) {
          var events = [];

          if (sn.type !== 'final') {
            return events;
          }

          var parent = sn.parent;

          if (!parent.parent) {
            return events;
          }

          events.push(done(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
          done(parent.id, sn.doneData ? mapContext(sn.doneData, currentContext, _event) : undefined));
          var grandparent = parent.parent;

          if (grandparent.type === 'parallel') {
            if (getChildren(grandparent).every(function (parentNode) {
              return isInFinalState(transition.configuration, parentNode);
            })) {
              events.push(done(grandparent.id));
            }
          }

          return events;
        }));
        transition.exitSet.sort(function (a, b) {
          return b.order - a.order;
        });
        transition.entrySet.sort(function (a, b) {
          return a.order - b.order;
        });
        var entryStates = new Set(transition.entrySet);
        var exitStates = new Set(transition.exitSet);

        var _c = __read([flatten(Array.from(entryStates).map(function (stateNode) {
          return __spreadArray(__spreadArray([], __read(stateNode.activities.map(function (activity) {
            return start$1(activity);
          }))), __read(stateNode.onEntry));
        })).concat(doneEvents.map(raise$1)), flatten(Array.from(exitStates).map(function (stateNode) {
          return __spreadArray(__spreadArray([], __read(stateNode.onExit)), __read(stateNode.activities.map(function (activity) {
            return stop$1(activity);
          })));
        }))], 2),
            entryActions = _c[0],
            exitActions = _c[1];

        var actions = toActionObjects(exitActions.concat(transition.actions).concat(entryActions), this.machine.options.actions);
        return actions;
      };
      /**
       * Determines the next state given the current `state` and sent `event`.
       *
       * @param state The current State instance or state value
       * @param event The event that was sent at the current state
       * @param context The current context (extended state) of the current state
       */


      StateNode.prototype.transition = function (state, event, context) {
        if (state === void 0) {
          state = this.initialState;
        }

        var _event = toSCXMLEvent(event);

        var currentState;

        if (state instanceof State) {
          currentState = context === undefined ? state : this.resolveState(State.from(state, context));
        } else {
          var resolvedStateValue = isString(state) ? this.resolve(pathToStateValue(this.getResolvedPath(state))) : this.resolve(state);
          var resolvedContext = context ? context : this.machine.context;
          currentState = this.resolveState(State.from(resolvedStateValue, resolvedContext));
        }

        if (this.strict) {
          if (!this.events.includes(_event.name) && !isBuiltInEvent(_event.name)) {
            throw new Error("Machine '" + this.id + "' does not accept event '" + _event.name + "'");
          }
        }

        var stateTransition = this._transition(currentState.value, currentState, _event) || {
          transitions: [],
          configuration: [],
          entrySet: [],
          exitSet: [],
          source: currentState,
          actions: []
        };
        var prevConfig = getConfiguration([], this.getStateNodes(currentState.value));
        var resolvedConfig = stateTransition.configuration.length ? getConfiguration(prevConfig, stateTransition.configuration) : prevConfig;
        stateTransition.configuration = __spreadArray([], __read(resolvedConfig));
        return this.resolveTransition(stateTransition, currentState, _event);
      };

      StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent) {
        var _a;

        var currentActions = state.actions;
        state = this.transition(state, _event); // Save original event to state
        // TODO: this should be the raised event! Delete in V5 (breaking)

        state._event = originalEvent;
        state.event = originalEvent.data;

        (_a = state.actions).unshift.apply(_a, __spreadArray([], __read(currentActions)));

        return state;
      };

      StateNode.prototype.resolveTransition = function (stateTransition, currentState, _event, context) {
        var e_6, _a;

        var _this = this;

        if (_event === void 0) {
          _event = initEvent;
        }

        if (context === void 0) {
          context = this.machine.context;
        }

        var configuration = stateTransition.configuration; // Transition will "apply" if:
        // - this is the initial state (there is no current state)
        // - OR there are transitions

        var willTransition = !currentState || stateTransition.transitions.length > 0;
        var resolvedStateValue = willTransition ? getValue(this.machine, configuration) : undefined;
        var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
        var currentContext = currentState ? currentState.context : context;
        var actions = this.getActions(stateTransition, currentContext, _event, currentState);
        var activities = currentState ? __assign({}, currentState.activities) : {};

        try {
          for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
            var action = actions_1_1.value;

            if (action.type === start) {
              activities[action.activity.id || action.activity.type] = action;
            } else if (action.type === stop) {
              activities[action.activity.id || action.activity.type] = false;
            }
          }
        } catch (e_6_1) {
          e_6 = {
            error: e_6_1
          };
        } finally {
          try {
            if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
          } finally {
            if (e_6) throw e_6.error;
          }
        }

        var _b = __read(resolveActions(this, currentState, currentContext, _event, actions), 2),
            resolvedActions = _b[0],
            updatedContext = _b[1];

        var _c = __read(partition(resolvedActions, function (action) {
          return action.type === raise || action.type === send && action.to === SpecialTargets.Internal;
        }), 2),
            raisedEvents = _c[0],
            nonRaisedActions = _c[1];

        var invokeActions = resolvedActions.filter(function (action) {
          var _a;

          return action.type === start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === invoke;
        });
        var children = invokeActions.reduce(function (acc, action) {
          acc[action.activity.id] = createInvocableActor(action.activity, _this.machine, updatedContext, _event);
          return acc;
        }, currentState ? __assign({}, currentState.children) : {});
        var resolvedConfiguration = resolvedStateValue ? stateTransition.configuration : currentState ? currentState.configuration : [];
        var isDone = isInFinalState(resolvedConfiguration, this);
        var nextState = new State({
          value: resolvedStateValue || currentState.value,
          context: updatedContext,
          _event: _event,
          // Persist _sessionid between states
          _sessionid: currentState ? currentState._sessionid : null,
          historyValue: resolvedStateValue ? historyValue ? updateHistoryValue(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
          history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
          actions: resolvedStateValue ? nonRaisedActions : [],
          activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
          events: [],
          configuration: resolvedConfiguration,
          transitions: stateTransition.transitions,
          children: children,
          done: isDone,
          tags: currentState === null || currentState === void 0 ? void 0 : currentState.tags
        });
        var didUpdateContext = currentContext !== updatedContext;
        nextState.changed = _event.name === update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

        var history = nextState.history;

        if (history) {
          delete history.history;
        } // There are transient transitions if the machine is not in a final state
        // and if some of the state nodes have transient ("always") transitions.


        var isTransient = !isDone && (this._transient || configuration.some(function (stateNode) {
          return stateNode._transient;
        })); // If there are no enabled transitions, check if there are transient transitions.
        // If there are transient transitions, continue checking for more transitions
        // because an transient transition should be triggered even if there are no
        // enabled transitions.
        //
        // If we're already working on an transient transition (by checking
        // if the event is a NULL_EVENT), then stop to prevent an infinite loop.
        //
        // Otherwise, if there are no enabled nor transient transitions, we are done.

        if (!willTransition && (!isTransient || _event.name === NULL_EVENT)) {
          return nextState;
        }

        var maybeNextState = nextState;

        if (!isDone) {
          if (isTransient) {
            maybeNextState = this.resolveRaisedTransition(maybeNextState, {
              type: nullEvent
            }, _event);
          }

          while (raisedEvents.length) {
            var raisedEvent = raisedEvents.shift();
            maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event);
          }
        } // Detect if state changed


        var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !stateValuesEqual(maybeNextState.value, history.value) : undefined);
        maybeNextState.changed = changed; // Preserve original history after raised events

        maybeNextState.history = history;
        maybeNextState.tags = new Set(flatten(maybeNextState.configuration.map(function (sn) {
          return sn.tags;
        })));
        return maybeNextState;
      };
      /**
       * Returns the child state node from its relative `stateKey`, or throws.
       */


      StateNode.prototype.getStateNode = function (stateKey) {
        if (isStateId(stateKey)) {
          return this.machine.getStateNodeById(stateKey);
        }

        if (!this.states) {
          throw new Error("Unable to retrieve child state '" + stateKey + "' from '" + this.id + "'; no child states exist.");
        }

        var result = this.states[stateKey];

        if (!result) {
          throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
        }

        return result;
      };
      /**
       * Returns the state node with the given `stateId`, or throws.
       *
       * @param stateId The state ID. The prefix "#" is removed.
       */


      StateNode.prototype.getStateNodeById = function (stateId) {
        var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

        if (resolvedStateId === this.id) {
          return this;
        }

        var stateNode = this.machine.idMap[resolvedStateId];

        if (!stateNode) {
          throw new Error("Child state node '#" + resolvedStateId + "' does not exist on machine '" + this.id + "'");
        }

        return stateNode;
      };
      /**
       * Returns the relative state node from the given `statePath`, or throws.
       *
       * @param statePath The string or string array relative path to the state node.
       */


      StateNode.prototype.getStateNodeByPath = function (statePath) {
        if (typeof statePath === 'string' && isStateId(statePath)) {
          try {
            return this.getStateNodeById(statePath.slice(1));
          } catch (e) {// try individual paths
            // throw e;
          }
        }

        var arrayStatePath = toStatePath(statePath, this.delimiter).slice();
        var currentStateNode = this;

        while (arrayStatePath.length) {
          var key = arrayStatePath.shift();

          if (!key.length) {
            break;
          }

          currentStateNode = currentStateNode.getStateNode(key);
        }

        return currentStateNode;
      };
      /**
       * Resolves a partial state value with its full representation in this machine.
       *
       * @param stateValue The partial state value to resolve.
       */


      StateNode.prototype.resolve = function (stateValue) {
        var _a;

        var _this = this;

        if (!stateValue) {
          return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
        }

        switch (this.type) {
          case 'parallel':
            return mapValues(this.initialStateValue, function (subStateValue, subStateKey) {
              return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
            });

          case 'compound':
            if (isString(stateValue)) {
              var subStateNode = this.getStateNode(stateValue);

              if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
                return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
              }

              return stateValue;
            }

            if (!keys(stateValue).length) {
              return this.initialStateValue || {};
            }

            return mapValues(stateValue, function (subStateValue, subStateKey) {
              return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
            });

          default:
            return stateValue || EMPTY_OBJECT;
        }
      };

      StateNode.prototype.getResolvedPath = function (stateIdentifier) {
        if (isStateId(stateIdentifier)) {
          var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

          if (!stateNode) {
            throw new Error("Unable to find state node '" + stateIdentifier + "'");
          }

          return stateNode.path;
        }

        return toStatePath(stateIdentifier, this.delimiter);
      };

      Object.defineProperty(StateNode.prototype, "initialStateValue", {
        get: function () {
          var _a;

          if (this.__cache.initialStateValue) {
            return this.__cache.initialStateValue;
          }

          var initialStateValue;

          if (this.type === 'parallel') {
            initialStateValue = mapFilterValues(this.states, function (state) {
              return state.initialStateValue || EMPTY_OBJECT;
            }, function (stateNode) {
              return !(stateNode.type === 'history');
            });
          } else if (this.initial !== undefined) {
            if (!this.states[this.initial]) {
              throw new Error("Initial state '" + this.initial + "' not found on '" + this.key + "'");
            }

            initialStateValue = isLeafNode(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
          } else {
            // The finite state value of a machine without child states is just an empty object
            initialStateValue = {};
          }

          this.__cache.initialStateValue = initialStateValue;
          return this.__cache.initialStateValue;
        },
        enumerable: false,
        configurable: true
      });

      StateNode.prototype.getInitialState = function (stateValue, context) {
        var configuration = this.getStateNodes(stateValue);
        return this.resolveTransition({
          configuration: configuration,
          entrySet: configuration,
          exitSet: [],
          transitions: [],
          source: undefined,
          actions: []
        }, undefined, undefined, context);
      };

      Object.defineProperty(StateNode.prototype, "initialState", {
        /**
         * The initial State instance, which includes all actions to be executed from
         * entering the initial state.
         */
        get: function () {
          this._init(); // TODO: this should be in the constructor (see note in constructor)


          var initialStateValue = this.initialStateValue;

          if (!initialStateValue) {
            throw new Error("Cannot retrieve initial state from simple state '" + this.id + "'.");
          }

          return this.getInitialState(initialStateValue);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(StateNode.prototype, "target", {
        /**
         * The target state value of the history state node, if it exists. This represents the
         * default state value to transition to if no history value exists yet.
         */
        get: function () {
          var target;

          if (this.type === 'history') {
            var historyConfig = this.config;

            if (isString(historyConfig.target)) {
              target = isStateId(historyConfig.target) ? pathToStateValue(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
            } else {
              target = historyConfig.target;
            }
          }

          return target;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Returns the leaf nodes from a state path relative to this state node.
       *
       * @param relativeStateId The relative state path to retrieve the state nodes
       * @param history The previous state to retrieve history
       * @param resolve Whether state nodes should resolve to initial child state nodes
       */

      StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
        if (resolve === void 0) {
          resolve = true;
        }

        return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
      };

      Object.defineProperty(StateNode.prototype, "initialStateNodes", {
        get: function () {
          var _this = this;

          if (isLeafNode(this)) {
            return [this];
          } // Case when state node is compound but no initial state is defined


          if (this.type === 'compound' && !this.initial) {

            return [this];
          }

          var initialStateNodePaths = toStatePaths(this.initialStateValue);
          return flatten(initialStateNodePaths.map(function (initialPath) {
            return _this.getFromRelativePath(initialPath);
          }));
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Retrieves state nodes from a relative path to this state node.
       *
       * @param relativePath The relative path from this state node
       * @param historyValue
       */

      StateNode.prototype.getFromRelativePath = function (relativePath) {
        if (!relativePath.length) {
          return [this];
        }

        var _a = __read(relativePath),
            stateKey = _a[0],
            childStatePath = _a.slice(1);

        if (!this.states) {
          throw new Error("Cannot retrieve subPath '" + stateKey + "' from node with no states");
        }

        var childStateNode = this.getStateNode(stateKey);

        if (childStateNode.type === 'history') {
          return childStateNode.resolveHistory();
        }

        if (!this.states[stateKey]) {
          throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
        }

        return this.states[stateKey].getFromRelativePath(childStatePath);
      };

      StateNode.prototype.historyValue = function (relativeStateValue) {
        if (!keys(this.states).length) {
          return undefined;
        }

        return {
          current: relativeStateValue || this.initialStateValue,
          states: mapFilterValues(this.states, function (stateNode, key) {
            if (!relativeStateValue) {
              return stateNode.historyValue();
            }

            var subStateValue = isString(relativeStateValue) ? undefined : relativeStateValue[key];
            return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
          }, function (stateNode) {
            return !stateNode.history;
          })
        };
      };
      /**
       * Resolves to the historical value(s) of the parent state node,
       * represented by state nodes.
       *
       * @param historyValue
       */


      StateNode.prototype.resolveHistory = function (historyValue) {
        var _this = this;

        if (this.type !== 'history') {
          return [this];
        }

        var parent = this.parent;

        if (!historyValue) {
          var historyTarget = this.target;
          return historyTarget ? flatten(toStatePaths(historyTarget).map(function (relativeChildPath) {
            return parent.getFromRelativePath(relativeChildPath);
          })) : parent.initialStateNodes;
        }

        var subHistoryValue = nestedPath(parent.path, 'states')(historyValue).current;

        if (isString(subHistoryValue)) {
          return [parent.getStateNode(subHistoryValue)];
        }

        return flatten(toStatePaths(subHistoryValue).map(function (subStatePath) {
          return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
        }));
      };

      Object.defineProperty(StateNode.prototype, "stateIds", {
        /**
         * All the state node IDs of this state node and its descendant state nodes.
         */
        get: function () {
          var _this = this;

          var childStateIds = flatten(keys(this.states).map(function (stateKey) {
            return _this.states[stateKey].stateIds;
          }));
          return [this.id].concat(childStateIds);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(StateNode.prototype, "events", {
        /**
         * All the event types accepted by this state node and its descendants.
         */
        get: function () {
          var e_7, _a, e_8, _b;

          if (this.__cache.events) {
            return this.__cache.events;
          }

          var states = this.states;
          var events = new Set(this.ownEvents);

          if (states) {
            try {
              for (var _c = __values(keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var stateId = _d.value;
                var state = states[stateId];

                if (state.states) {
                  try {
                    for (var _e = (e_8 = void 0, __values(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                      var event_1 = _f.value;
                      events.add("" + event_1);
                    }
                  } catch (e_8_1) {
                    e_8 = {
                      error: e_8_1
                    };
                  } finally {
                    try {
                      if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    } finally {
                      if (e_8) throw e_8.error;
                    }
                  }
                }
              }
            } catch (e_7_1) {
              e_7 = {
                error: e_7_1
              };
            } finally {
              try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
              } finally {
                if (e_7) throw e_7.error;
              }
            }
          }

          return this.__cache.events = Array.from(events);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(StateNode.prototype, "ownEvents", {
        /**
         * All the events that have transitions directly from this state node.
         *
         * Excludes any inert events.
         */
        get: function () {
          var events = new Set(this.transitions.filter(function (transition) {
            return !(!transition.target && !transition.actions.length && transition.internal);
          }).map(function (transition) {
            return transition.eventType;
          }));
          return Array.from(events);
        },
        enumerable: false,
        configurable: true
      });

      StateNode.prototype.resolveTarget = function (_target) {
        var _this = this;

        if (_target === undefined) {
          // an undefined target signals that the state node should not transition from that state when receiving that event
          return undefined;
        }

        return _target.map(function (target) {
          if (!isString(target)) {
            return target;
          }

          var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
          // do not include machine key on target

          if (isInternalTarget && !_this.parent) {
            return _this.getStateNodeByPath(target.slice(1));
          }

          var resolvedTarget = isInternalTarget ? _this.key + target : target;

          if (_this.parent) {
            try {
              var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

              return targetStateNode;
            } catch (err) {
              throw new Error("Invalid transition definition for state node '" + _this.id + "':\n" + err.message);
            }
          } else {
            return _this.getStateNodeByPath(resolvedTarget);
          }
        });
      };

      StateNode.prototype.formatTransition = function (transitionConfig) {
        var _this = this;

        var normalizedTarget = normalizeTarget(transitionConfig.target);
        var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
          return isString(_target) && _target[0] === _this.delimiter;
        }) : true;
        var guards = this.machine.options.guards;
        var target = this.resolveTarget(normalizedTarget);

        var transition = __assign(__assign({}, transitionConfig), {
          actions: toActionObjects(toArray(transitionConfig.actions)),
          cond: toGuard(transitionConfig.cond, guards),
          target: target,
          source: this,
          internal: internal,
          eventType: transitionConfig.event,
          toJSON: function () {
            return __assign(__assign({}, transition), {
              target: transition.target ? transition.target.map(function (t) {
                return "#" + t.id;
              }) : undefined,
              source: "#" + _this.id
            });
          }
        });

        return transition;
      };

      StateNode.prototype.formatTransitions = function () {
        var e_9, _a;

        var _this = this;

        var onConfig;

        if (!this.config.on) {
          onConfig = [];
        } else if (Array.isArray(this.config.on)) {
          onConfig = this.config.on;
        } else {
          var _b = this.config.on,
              _c = WILDCARD,
              _d = _b[_c],
              wildcardConfigs = _d === void 0 ? [] : _d,
              strictTransitionConfigs_1 = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);

          onConfig = flatten(keys(strictTransitionConfigs_1).map(function (key) {

            var transitionConfigArray = toTransitionConfigArray(key, strictTransitionConfigs_1[key]);

            return transitionConfigArray;
          }).concat(toTransitionConfigArray(WILDCARD, wildcardConfigs)));
        }

        var eventlessConfig = this.config.always ? toTransitionConfigArray('', this.config.always) : [];
        var doneConfig = this.config.onDone ? toTransitionConfigArray(String(done(this.id)), this.config.onDone) : [];

        var invokeConfig = flatten(this.invoke.map(function (invokeDef) {
          var settleTransitions = [];

          if (invokeDef.onDone) {
            settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(doneInvoke(invokeDef.id)), invokeDef.onDone))));
          }

          if (invokeDef.onError) {
            settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(error$1(invokeDef.id)), invokeDef.onError))));
          }

          return settleTransitions;
        }));
        var delayedTransitions = this.after;
        var formattedTransitions = flatten(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(doneConfig)), __read(invokeConfig)), __read(onConfig)), __read(eventlessConfig)).map(function (transitionConfig) {
          return toArray(transitionConfig).map(function (transition) {
            return _this.formatTransition(transition);
          });
        }));

        try {
          for (var delayedTransitions_1 = __values(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
            var delayedTransition = delayedTransitions_1_1.value;
            formattedTransitions.push(delayedTransition);
          }
        } catch (e_9_1) {
          e_9 = {
            error: e_9_1
          };
        } finally {
          try {
            if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
          } finally {
            if (e_9) throw e_9.error;
          }
        }

        return formattedTransitions;
      };

      return StateNode;
    }();

    function createMachine(config, options) {
      var resolvedInitialContext = typeof config.context === 'function' ? config.context() : config.context;
      return new StateNode(config, options, resolvedInitialContext);
    }

    var defaultOptions = {
      deferEvents: false
    };

    var Scheduler =
    /*#__PURE__*/

    /** @class */
    function () {
      function Scheduler(options) {
        this.processingEvent = false;
        this.queue = [];
        this.initialized = false;
        this.options = __assign(__assign({}, defaultOptions), options);
      }

      Scheduler.prototype.initialize = function (callback) {
        this.initialized = true;

        if (callback) {
          if (!this.options.deferEvents) {
            this.schedule(callback);
            return;
          }

          this.process(callback);
        }

        this.flushEvents();
      };

      Scheduler.prototype.schedule = function (task) {
        if (!this.initialized || this.processingEvent) {
          this.queue.push(task);
          return;
        }

        if (this.queue.length !== 0) {
          throw new Error('Event queue should be empty when it is not processing events');
        }

        this.process(task);
        this.flushEvents();
      };

      Scheduler.prototype.clear = function () {
        this.queue = [];
      };

      Scheduler.prototype.flushEvents = function () {
        var nextCallback = this.queue.shift();

        while (nextCallback) {
          this.process(nextCallback);
          nextCallback = this.queue.shift();
        }
      };

      Scheduler.prototype.process = function (callback) {
        this.processingEvent = true;

        try {
          callback();
        } catch (e) {
          // there is no use to keep the future events
          // as the situation is not anymore the same
          this.clear();
          throw e;
        } finally {
          this.processingEvent = false;
        }
      };

      return Scheduler;
    }();

    var children = /*#__PURE__*/new Map();
    var sessionIdIndex = 0;
    var registry = {
      bookId: function () {
        return "x:" + sessionIdIndex++;
      },
      register: function (id, actor) {
        children.set(id, actor);
        return id;
      },
      get: function (id) {
        return children.get(id);
      },
      free: function (id) {
        children.delete(id);
      }
    };

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
    function getGlobal() {
      if (typeof self !== 'undefined') {
        return self;
      }

      if (typeof window !== 'undefined') {
        return window;
      }

      if (typeof global !== 'undefined') {
        return global;
      }

      return undefined;
    }

    function getDevTools() {
      var global = getGlobal();

      if (global && '__xstate__' in global) {
        return global.__xstate__;
      }

      return undefined;
    }

    function registerService(service) {
      if (!getGlobal()) {
        return;
      }

      var devTools = getDevTools();

      if (devTools) {
        devTools.register(service);
      }
    }

    var DEFAULT_SPAWN_OPTIONS = {
      sync: false,
      autoForward: false
    };
    var InterpreterStatus;

    (function (InterpreterStatus) {
      InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
      InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
      InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
    })(InterpreterStatus || (InterpreterStatus = {}));

    var Interpreter =
    /*#__PURE__*/

    /** @class */
    function () {
      /**
       * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
       *
       * @param machine The machine to be interpreted
       * @param options Interpreter options
       */
      function Interpreter(machine, options) {
        var _this = this;

        if (options === void 0) {
          options = Interpreter.defaultOptions;
        }

        this.machine = machine;
        this.scheduler = new Scheduler();
        this.delayedEventsMap = {};
        this.listeners = new Set();
        this.contextListeners = new Set();
        this.stopListeners = new Set();
        this.doneListeners = new Set();
        this.eventListeners = new Set();
        this.sendListeners = new Set();
        /**
         * Whether the service is started.
         */

        this.initialized = false;
        this.status = InterpreterStatus.NotStarted;
        this.children = new Map();
        this.forwardTo = new Set();
        /**
         * Alias for Interpreter.prototype.start
         */

        this.init = this.start;
        /**
         * Sends an event to the running interpreter to trigger a transition.
         *
         * An array of events (batched) can be sent as well, which will send all
         * batched events to the running interpreter. The listeners will be
         * notified only **once** when all events are processed.
         *
         * @param event The event(s) to send
         */

        this.send = function (event, payload) {
          if (isArray(event)) {
            _this.batch(event);

            return _this.state;
          }

          var _event = toSCXMLEvent(toEventObject(event, payload));

          if (_this.status === InterpreterStatus.Stopped) {

            return _this.state;
          }

          if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
            throw new Error("Event \"" + _event.name + "\" was sent to uninitialized service \"" + _this.machine.id + "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: " + JSON.stringify(_event.data));
          }

          _this.scheduler.schedule(function () {
            // Forward copy of event to child actors
            _this.forward(_event);

            var nextState = _this.nextState(_event);

            _this.update(nextState, _event);
          });

          return _this._state; // TODO: deprecate (should return void)
          // tslint:disable-next-line:semicolon
        };

        this.sendTo = function (event, to) {
          var isParent = _this.parent && (to === SpecialTargets.Parent || _this.parent.id === to);
          var target = isParent ? _this.parent : isString(to) ? _this.children.get(to) || registry.get(to) : isActor(to) ? to : undefined;

          if (!target) {
            if (!isParent) {
              throw new Error("Unable to send event to child '" + to + "' from service '" + _this.id + "'.");
            } // tslint:disable-next-line:no-console

            return;
          }

          if ('machine' in target) {
            // Send SCXML events to machines
            target.send(__assign(__assign({}, event), {
              name: event.name === error ? "" + error$1(_this.id) : event.name,
              origin: _this.sessionId
            }));
          } else {
            // Send normal events to other targets
            target.send(event.data);
          }
        };

        var resolvedOptions = __assign(__assign({}, Interpreter.defaultOptions), options);

        var clock = resolvedOptions.clock,
            logger = resolvedOptions.logger,
            parent = resolvedOptions.parent,
            id = resolvedOptions.id;
        var resolvedId = id !== undefined ? id : machine.id;
        this.id = resolvedId;
        this.logger = logger;
        this.clock = clock;
        this.parent = parent;
        this.options = resolvedOptions;
        this.scheduler = new Scheduler({
          deferEvents: this.options.deferEvents
        });
        this.sessionId = registry.bookId();
      }

      Object.defineProperty(Interpreter.prototype, "initialState", {
        get: function () {
          var _this = this;

          if (this._initialState) {
            return this._initialState;
          }

          return provide(this, function () {
            _this._initialState = _this.machine.initialState;
            return _this._initialState;
          });
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Interpreter.prototype, "state", {
        get: function () {

          return this._state;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Executes the actions of the given state, with that state's `context` and `event`.
       *
       * @param state The state whose actions will be executed
       * @param actionsConfig The action implementations to use
       */

      Interpreter.prototype.execute = function (state, actionsConfig) {
        var e_1, _a;

        try {
          for (var _b = __values(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
            var action = _c.value;
            this.exec(action, state, actionsConfig);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      };

      Interpreter.prototype.update = function (state, _event) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

        var _this = this; // Attach session ID to state


        state._sessionid = this.sessionId; // Update state

        this._state = state; // Execute actions

        if (this.options.execute) {
          this.execute(this.state);
        } // Update children


        this.children.forEach(function (child) {
          _this.state.children[child.id] = child;
        }); // Dev tools

        if (this.devTools) {
          this.devTools.send(_event.data, state);
        } // Execute listeners


        if (state.event) {
          try {
            for (var _e = __values(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
              var listener = _f.value;
              listener(state.event);
            }
          } catch (e_2_1) {
            e_2 = {
              error: e_2_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }

        try {
          for (var _g = __values(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
            var listener = _h.value;
            listener(state, state.event);
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
          } finally {
            if (e_3) throw e_3.error;
          }
        }

        try {
          for (var _j = __values(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
            var contextListener = _k.value;
            contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
          }
        } catch (e_4_1) {
          e_4 = {
            error: e_4_1
          };
        } finally {
          try {
            if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
          } finally {
            if (e_4) throw e_4.error;
          }
        }

        var isDone = isInFinalState(state.configuration || [], this.machine);

        if (this.state.configuration && isDone) {
          // get final child state node
          var finalChildStateNode = state.configuration.find(function (sn) {
            return sn.type === 'final' && sn.parent === _this.machine;
          });
          var doneData = finalChildStateNode && finalChildStateNode.doneData ? mapContext(finalChildStateNode.doneData, state.context, _event) : undefined;

          try {
            for (var _l = __values(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
              var listener = _m.value;
              listener(doneInvoke(this.id, doneData));
            }
          } catch (e_5_1) {
            e_5 = {
              error: e_5_1
            };
          } finally {
            try {
              if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
            } finally {
              if (e_5) throw e_5.error;
            }
          }

          this.stop();
        }
      };
      /*
       * Adds a listener that is notified whenever a state transition happens. The listener is called with
       * the next state and the event object that caused the state transition.
       *
       * @param listener The state listener
       */


      Interpreter.prototype.onTransition = function (listener) {
        this.listeners.add(listener); // Send current state to listener

        if (this.status === InterpreterStatus.Running) {
          listener(this.state, this.state.event);
        }

        return this;
      };

      Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
      completeListener) {
        var _this = this;

        if (!nextListenerOrObserver) {
          return {
            unsubscribe: function () {
              return void 0;
            }
          };
        }

        var listener;
        var resolvedCompleteListener = completeListener;

        if (typeof nextListenerOrObserver === 'function') {
          listener = nextListenerOrObserver;
        } else {
          listener = nextListenerOrObserver.next.bind(nextListenerOrObserver);
          resolvedCompleteListener = nextListenerOrObserver.complete.bind(nextListenerOrObserver);
        }

        this.listeners.add(listener); // Send current state to listener

        if (this.status === InterpreterStatus.Running) {
          listener(this.state);
        }

        if (resolvedCompleteListener) {
          this.onDone(resolvedCompleteListener);
        }

        return {
          unsubscribe: function () {
            listener && _this.listeners.delete(listener);
            resolvedCompleteListener && _this.doneListeners.delete(resolvedCompleteListener);
          }
        };
      };
      /**
       * Adds an event listener that is notified whenever an event is sent to the running interpreter.
       * @param listener The event listener
       */


      Interpreter.prototype.onEvent = function (listener) {
        this.eventListeners.add(listener);
        return this;
      };
      /**
       * Adds an event listener that is notified whenever a `send` event occurs.
       * @param listener The event listener
       */


      Interpreter.prototype.onSend = function (listener) {
        this.sendListeners.add(listener);
        return this;
      };
      /**
       * Adds a context listener that is notified whenever the state context changes.
       * @param listener The context listener
       */


      Interpreter.prototype.onChange = function (listener) {
        this.contextListeners.add(listener);
        return this;
      };
      /**
       * Adds a listener that is notified when the machine is stopped.
       * @param listener The listener
       */


      Interpreter.prototype.onStop = function (listener) {
        this.stopListeners.add(listener);
        return this;
      };
      /**
       * Adds a state listener that is notified when the statechart has reached its final state.
       * @param listener The state listener
       */


      Interpreter.prototype.onDone = function (listener) {
        this.doneListeners.add(listener);
        return this;
      };
      /**
       * Removes a listener.
       * @param listener The listener to remove
       */


      Interpreter.prototype.off = function (listener) {
        this.listeners.delete(listener);
        this.eventListeners.delete(listener);
        this.sendListeners.delete(listener);
        this.stopListeners.delete(listener);
        this.doneListeners.delete(listener);
        this.contextListeners.delete(listener);
        return this;
      };
      /**
       * Starts the interpreter from the given state, or the initial state.
       * @param initialState The state to start the statechart from
       */


      Interpreter.prototype.start = function (initialState) {
        var _this = this;

        if (this.status === InterpreterStatus.Running) {
          // Do not restart the service if it is already started
          return this;
        }

        registry.register(this.sessionId, this);
        this.initialized = true;
        this.status = InterpreterStatus.Running;
        var resolvedState = initialState === undefined ? this.initialState : provide(this, function () {
          return isState(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(State.from(initialState, _this.machine.context));
        });

        if (this.options.devTools) {
          this.attachDev();
        }

        this.scheduler.initialize(function () {
          _this.update(resolvedState, initEvent);
        });
        return this;
      };
      /**
       * Stops the interpreter and unsubscribe all listeners.
       *
       * This will also notify the `onStop` listeners.
       */


      Interpreter.prototype.stop = function () {
        var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

        var _this = this;

        try {
          for (var _f = __values(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
            var listener = _g.value;
            this.listeners.delete(listener);
          }
        } catch (e_6_1) {
          e_6 = {
            error: e_6_1
          };
        } finally {
          try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
          } finally {
            if (e_6) throw e_6.error;
          }
        }

        try {
          for (var _h = __values(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
            var listener = _j.value; // call listener, then remove

            listener();
            this.stopListeners.delete(listener);
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
          } finally {
            if (e_7) throw e_7.error;
          }
        }

        try {
          for (var _k = __values(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
            var listener = _l.value;
            this.contextListeners.delete(listener);
          }
        } catch (e_8_1) {
          e_8 = {
            error: e_8_1
          };
        } finally {
          try {
            if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
          } finally {
            if (e_8) throw e_8.error;
          }
        }

        try {
          for (var _m = __values(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
            var listener = _o.value;
            this.doneListeners.delete(listener);
          }
        } catch (e_9_1) {
          e_9 = {
            error: e_9_1
          };
        } finally {
          try {
            if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
          } finally {
            if (e_9) throw e_9.error;
          }
        }

        if (!this.initialized) {
          // Interpreter already stopped; do nothing
          return this;
        }

        this.state.configuration.forEach(function (stateNode) {
          var e_11, _a;

          try {
            for (var _b = __values(stateNode.definition.exit), _c = _b.next(); !_c.done; _c = _b.next()) {
              var action = _c.value;

              _this.exec(action, _this.state);
            }
          } catch (e_11_1) {
            e_11 = {
              error: e_11_1
            };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_11) throw e_11.error;
            }
          }
        }); // Stop all children

        this.children.forEach(function (child) {
          if (isFunction(child.stop)) {
            child.stop();
          }
        });

        try {
          // Cancel all delayed events
          for (var _p = __values(keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
            var key = _q.value;
            this.clock.clearTimeout(this.delayedEventsMap[key]);
          }
        } catch (e_10_1) {
          e_10 = {
            error: e_10_1
          };
        } finally {
          try {
            if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
          } finally {
            if (e_10) throw e_10.error;
          }
        }

        this.scheduler.clear();
        this.initialized = false;
        this.status = InterpreterStatus.Stopped;
        registry.free(this.sessionId);
        return this;
      };

      Interpreter.prototype.batch = function (events) {
        var _this = this;

        if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) ; else if (this.status !== InterpreterStatus.Running) {
          throw new Error( // tslint:disable-next-line:max-line-length
          events.length + " event(s) were sent to uninitialized service \"" + this.machine.id + "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.");
        }

        this.scheduler.schedule(function () {
          var e_12, _a;

          var nextState = _this.state;
          var batchChanged = false;
          var batchedActions = [];

          var _loop_1 = function (event_1) {
            var _event = toSCXMLEvent(event_1);

            _this.forward(_event);

            nextState = provide(_this, function () {
              return _this.machine.transition(nextState, _event);
            });
            batchedActions.push.apply(batchedActions, __spreadArray([], __read(nextState.actions.map(function (a) {
              return bindActionToState(a, nextState);
            }))));
            batchChanged = batchChanged || !!nextState.changed;
          };

          try {
            for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
              var event_1 = events_1_1.value;

              _loop_1(event_1);
            }
          } catch (e_12_1) {
            e_12 = {
              error: e_12_1
            };
          } finally {
            try {
              if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
            } finally {
              if (e_12) throw e_12.error;
            }
          }

          nextState.changed = batchChanged;
          nextState.actions = batchedActions;

          _this.update(nextState, toSCXMLEvent(events[events.length - 1]));
        });
      };
      /**
       * Returns a send function bound to this interpreter instance.
       *
       * @param event The event to be sent by the sender.
       */


      Interpreter.prototype.sender = function (event) {
        return this.send.bind(this, event);
      };
      /**
       * Returns the next state given the interpreter's current state and the event.
       *
       * This is a pure method that does _not_ update the interpreter's state.
       *
       * @param event The event to determine the next state
       */


      Interpreter.prototype.nextState = function (event) {
        var _this = this;

        var _event = toSCXMLEvent(event);

        if (_event.name.indexOf(errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
          return nextEvent.indexOf(errorPlatform) === 0;
        })) {
          throw _event.data.data;
        }

        var nextState = provide(this, function () {
          return _this.machine.transition(_this.state, _event);
        });
        return nextState;
      };

      Interpreter.prototype.forward = function (event) {
        var e_13, _a;

        try {
          for (var _b = __values(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
            var id = _c.value;
            var child = this.children.get(id);

            if (!child) {
              throw new Error("Unable to forward event '" + event + "' from interpreter '" + this.id + "' to nonexistant child '" + id + "'.");
            }

            child.send(event);
          }
        } catch (e_13_1) {
          e_13 = {
            error: e_13_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_13) throw e_13.error;
          }
        }
      };

      Interpreter.prototype.defer = function (sendAction) {
        var _this = this;

        this.delayedEventsMap[sendAction.id] = this.clock.setTimeout(function () {
          if (sendAction.to) {
            _this.sendTo(sendAction._event, sendAction.to);
          } else {
            _this.send(sendAction._event);
          }
        }, sendAction.delay);
      };

      Interpreter.prototype.cancel = function (sendId) {
        this.clock.clearTimeout(this.delayedEventsMap[sendId]);
        delete this.delayedEventsMap[sendId];
      };

      Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
        if (actionFunctionMap === void 0) {
          actionFunctionMap = this.machine.options.actions;
        }

        var context = state.context,
            _event = state._event;
        var actionOrExec = action.exec || getActionFunction(action.type, actionFunctionMap);
        var exec = isFunction(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

        if (exec) {
          try {
            return exec(context, _event.data, {
              action: action,
              state: this.state,
              _event: _event
            });
          } catch (err) {
            if (this.parent) {
              this.parent.send({
                type: 'xstate.error',
                data: err
              });
            }

            throw err;
          }
        }

        switch (action.type) {
          case send:
            var sendAction = action;

            if (typeof sendAction.delay === 'number') {
              this.defer(sendAction);
              return;
            } else {
              if (sendAction.to) {
                this.sendTo(sendAction._event, sendAction.to);
              } else {
                this.send(sendAction._event);
              }
            }

            break;

          case cancel:
            this.cancel(action.sendId);
            break;

          case start:
            {
              var activity = action.activity; // If the activity will be stopped right after it's started
              // (such as in transient states)
              // don't bother starting the activity.

              if (!this.state.activities[activity.id || activity.type]) {
                break;
              } // Invoked services


              if (activity.type === ActionTypes.Invoke) {
                var invokeSource = toInvokeSource(activity.src);
                var serviceCreator = this.machine.options.services ? this.machine.options.services[invokeSource.type] : undefined;
                var id = activity.id,
                    data = activity.data;

                var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

                if (!serviceCreator) {

                  return;
                }

                var resolvedData = data ? mapContext(data, context, _event) : undefined;
                var source = isFunction(serviceCreator) ? serviceCreator(context, _event.data, {
                  data: resolvedData,
                  src: invokeSource
                }) : serviceCreator;

                if (isPromiseLike(source)) {
                  this.spawnPromise(Promise.resolve(source), id);
                } else if (isFunction(source)) {
                  this.spawnCallback(source, id);
                } else if (isObservable(source)) {
                  this.spawnObservable(source, id);
                } else if (isMachine(source)) {
                  // TODO: try/catch here
                  this.spawnMachine(resolvedData ? source.withContext(resolvedData) : source, {
                    id: id,
                    autoForward: autoForward
                  });
                } else ;
              } else {
                this.spawnActivity(activity);
              }

              break;
            }

          case stop:
            {
              this.stopChild(action.activity.id);
              break;
            }

          case log:
            var label = action.label,
                value = action.value;

            if (label) {
              this.logger(label, value);
            } else {
              this.logger(value);
            }

            break;
        }

        return undefined;
      };

      Interpreter.prototype.removeChild = function (childId) {
        this.children.delete(childId);
        this.forwardTo.delete(childId);
        delete this.state.children[childId];
      };

      Interpreter.prototype.stopChild = function (childId) {
        var child = this.children.get(childId);

        if (!child) {
          return;
        }

        this.removeChild(childId);

        if (isFunction(child.stop)) {
          child.stop();
        }
      };

      Interpreter.prototype.spawn = function (entity, name, options) {
        if (isPromiseLike(entity)) {
          return this.spawnPromise(Promise.resolve(entity), name);
        } else if (isFunction(entity)) {
          return this.spawnCallback(entity, name);
        } else if (isSpawnedActor(entity)) {
          return this.spawnActor(entity);
        } else if (isObservable(entity)) {
          return this.spawnObservable(entity, name);
        } else if (isMachine(entity)) {
          return this.spawnMachine(entity, __assign(__assign({}, options), {
            id: name
          }));
        } else {
          throw new Error("Unable to spawn entity \"" + name + "\" of type \"" + typeof entity + "\".");
        }
      };

      Interpreter.prototype.spawnMachine = function (machine, options) {
        var _this = this;

        if (options === void 0) {
          options = {};
        }

        var childService = new Interpreter(machine, __assign(__assign({}, this.options), {
          parent: this,
          id: options.id || machine.id
        }));

        var resolvedOptions = __assign(__assign({}, DEFAULT_SPAWN_OPTIONS), options);

        if (resolvedOptions.sync) {
          childService.onTransition(function (state) {
            _this.send(update, {
              state: state,
              id: childService.id
            });
          });
        }

        var actor = childService;
        this.children.set(childService.id, actor);

        if (resolvedOptions.autoForward) {
          this.forwardTo.add(childService.id);
        }

        childService.onDone(function (doneEvent) {
          _this.removeChild(childService.id);

          _this.send(toSCXMLEvent(doneEvent, {
            origin: childService.id
          }));
        }).start();
        return actor;
      };

      Interpreter.prototype.spawnPromise = function (promise, id) {
        var _this = this;

        var canceled = false;
        var resolvedData = undefined;
        promise.then(function (response) {
          if (!canceled) {
            resolvedData = response;

            _this.removeChild(id);

            _this.send(toSCXMLEvent(doneInvoke(id, response), {
              origin: id
            }));
          }
        }, function (errorData) {
          if (!canceled) {
            _this.removeChild(id);

            var errorEvent = error$1(id, errorData);

            try {
              // Send "error.platform.id" to this (parent).
              _this.send(toSCXMLEvent(errorEvent, {
                origin: id
              }));
            } catch (error) {

              if (_this.devTools) {
                _this.devTools.send(errorEvent, _this.state);
              }

              if (_this.machine.strict) {
                // it would be better to always stop the state machine if unhandled
                // exception/promise rejection happens but because we don't want to
                // break existing code so enforce it on strict mode only especially so
                // because documentation says that onError is optional
                _this.stop();
              }
            }
          }
        });
        var actor = {
          id: id,
          send: function () {
            return void 0;
          },
          subscribe: function (next, handleError, complete) {
            var observer = toObserver(next, handleError, complete);
            var unsubscribed = false;
            promise.then(function (response) {
              if (unsubscribed) {
                return;
              }

              observer.next(response);

              if (unsubscribed) {
                return;
              }

              observer.complete();
            }, function (err) {
              if (unsubscribed) {
                return;
              }

              observer.error(err);
            });
            return {
              unsubscribe: function () {
                return unsubscribed = true;
              }
            };
          },
          stop: function () {
            canceled = true;
          },
          toJSON: function () {
            return {
              id: id
            };
          },
          getSnapshot: function () {
            return resolvedData;
          }
        };
        this.children.set(id, actor);
        return actor;
      };

      Interpreter.prototype.spawnCallback = function (callback, id) {
        var _this = this;

        var canceled = false;
        var receivers = new Set();
        var listeners = new Set();
        var emitted = undefined;

        var receive = function (e) {
          emitted = e;
          listeners.forEach(function (listener) {
            return listener(e);
          });

          if (canceled) {
            return;
          }

          _this.send(toSCXMLEvent(e, {
            origin: id
          }));
        };

        var callbackStop;

        try {
          callbackStop = callback(receive, function (newListener) {
            receivers.add(newListener);
          });
        } catch (err) {
          this.send(error$1(id, err));
        }

        if (isPromiseLike(callbackStop)) {
          // it turned out to be an async function, can't reliably check this before calling `callback`
          // because transpiled async functions are not recognizable
          return this.spawnPromise(callbackStop, id);
        }

        var actor = {
          id: id,
          send: function (event) {
            return receivers.forEach(function (receiver) {
              return receiver(event);
            });
          },
          subscribe: function (next) {
            listeners.add(next);
            return {
              unsubscribe: function () {
                listeners.delete(next);
              }
            };
          },
          stop: function () {
            canceled = true;

            if (isFunction(callbackStop)) {
              callbackStop();
            }
          },
          toJSON: function () {
            return {
              id: id
            };
          },
          getSnapshot: function () {
            return emitted;
          }
        };
        this.children.set(id, actor);
        return actor;
      };

      Interpreter.prototype.spawnObservable = function (source, id) {
        var _this = this;

        var emitted = undefined;
        var subscription = source.subscribe(function (value) {
          emitted = value;

          _this.send(toSCXMLEvent(value, {
            origin: id
          }));
        }, function (err) {
          _this.removeChild(id);

          _this.send(toSCXMLEvent(error$1(id, err), {
            origin: id
          }));
        }, function () {
          _this.removeChild(id);

          _this.send(toSCXMLEvent(doneInvoke(id), {
            origin: id
          }));
        });
        var actor = {
          id: id,
          send: function () {
            return void 0;
          },
          subscribe: function (next, handleError, complete) {
            return source.subscribe(next, handleError, complete);
          },
          stop: function () {
            return subscription.unsubscribe();
          },
          getSnapshot: function () {
            return emitted;
          },
          toJSON: function () {
            return {
              id: id
            };
          }
        };
        this.children.set(id, actor);
        return actor;
      };

      Interpreter.prototype.spawnActor = function (actor) {
        this.children.set(actor.id, actor);
        return actor;
      };

      Interpreter.prototype.spawnActivity = function (activity) {
        var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

        if (!implementation) {


          return;
        } // Start implementation


        var dispose = implementation(this.state.context, activity);
        this.spawnEffect(activity.id, dispose);
      };

      Interpreter.prototype.spawnEffect = function (id, dispose) {
        this.children.set(id, {
          id: id,
          send: function () {
            return void 0;
          },
          subscribe: function () {
            return {
              unsubscribe: function () {
                return void 0;
              }
            };
          },
          stop: dispose || undefined,
          getSnapshot: function () {
            return undefined;
          },
          toJSON: function () {
            return {
              id: id
            };
          }
        });
      };

      Interpreter.prototype.attachDev = function () {
        var global = getGlobal();

        if (this.options.devTools && global) {
          if (global.__REDUX_DEVTOOLS_EXTENSION__) {
            var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
            this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect(__assign(__assign({
              name: this.id,
              autoPause: true,
              stateSanitizer: function (state) {
                return {
                  value: state.value,
                  context: state.context,
                  actions: state.actions
                };
              }
            }, devToolsOptions), {
              features: __assign({
                jump: false,
                skip: false
              }, devToolsOptions ? devToolsOptions.features : undefined)
            }), this.machine);
            this.devTools.init(this.state);
          } // add XState-specific dev tooling hook


          registerService(this);
        }
      };

      Interpreter.prototype.toJSON = function () {
        return {
          id: this.id
        };
      };

      Interpreter.prototype[symbolObservable] = function () {
        return this;
      };

      Interpreter.prototype.getSnapshot = function () {
        if (this.status === InterpreterStatus.NotStarted) {
          return this.initialState;
        }

        return this._state;
      };
      /**
       * The default interpreter options:
       *
       * - `clock` uses the global `setTimeout` and `clearTimeout` functions
       * - `logger` uses the global `console.log()` method
       */


      Interpreter.defaultOptions = /*#__PURE__*/function (global) {
        return {
          execute: true,
          deferEvents: true,
          clock: {
            setTimeout: function (fn, ms) {
              return setTimeout(fn, ms);
            },
            clearTimeout: function (id) {
              return clearTimeout(id);
            }
          },
          logger: global.console.log.bind(console),
          devTools: false
        };
      }(typeof self !== 'undefined' ? self : global);

      Interpreter.interpret = interpret;
      return Interpreter;
    }();
    /**
     * Creates a new Interpreter instance for the given machine with the provided options, if any.
     *
     * @param machine The machine to interpret
     * @param options Interpreter options
     */


    function interpret(machine, options) {
      var interpreter = new Interpreter(machine, options);
      return interpreter;
    }

    var EventListener = /** @class */ (function () {
        function EventListener(eventTarget, eventName) {
            this.eventTarget = eventTarget;
            this.eventName = eventName;
            this.unorderedBindings = new Set;
        }
        EventListener.prototype.connect = function () {
            this.eventTarget.addEventListener(this.eventName, this, false);
        };
        EventListener.prototype.disconnect = function () {
            this.eventTarget.removeEventListener(this.eventName, this, false);
        };
        // Binding observer delegate
        /** @hidden */
        EventListener.prototype.bindingConnected = function (binding) {
            this.unorderedBindings.add(binding);
        };
        /** @hidden */
        EventListener.prototype.bindingDisconnected = function (binding) {
            this.unorderedBindings.delete(binding);
        };
        EventListener.prototype.handleEvent = function (event) {
            var extendedEvent = extendEvent(event);
            for (var _i = 0, _a = this.bindings; _i < _a.length; _i++) {
                var binding = _a[_i];
                if (extendedEvent.immediatePropagationStopped) {
                    break;
                }
                else {
                    binding.handleEvent(extendedEvent);
                }
            }
        };
        Object.defineProperty(EventListener.prototype, "bindings", {
            get: function () {
                return Array.from(this.unorderedBindings).sort(function (left, right) {
                    var leftIndex = left.index, rightIndex = right.index;
                    return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
                });
            },
            enumerable: true,
            configurable: true
        });
        return EventListener;
    }());
    function extendEvent(event) {
        if ("immediatePropagationStopped" in event) {
            return event;
        }
        else {
            var stopImmediatePropagation_1 = event.stopImmediatePropagation;
            return Object.assign(event, {
                immediatePropagationStopped: false,
                stopImmediatePropagation: function () {
                    this.immediatePropagationStopped = true;
                    stopImmediatePropagation_1.call(this);
                }
            });
        }
    }

    var Dispatcher = /** @class */ (function () {
        function Dispatcher(application) {
            this.application = application;
            this.eventListenerMaps = new Map;
            this.started = false;
        }
        Dispatcher.prototype.start = function () {
            if (!this.started) {
                this.started = true;
                this.eventListeners.forEach(function (eventListener) { return eventListener.connect(); });
            }
        };
        Dispatcher.prototype.stop = function () {
            if (this.started) {
                this.started = false;
                this.eventListeners.forEach(function (eventListener) { return eventListener.disconnect(); });
            }
        };
        Object.defineProperty(Dispatcher.prototype, "eventListeners", {
            get: function () {
                return Array.from(this.eventListenerMaps.values())
                    .reduce(function (listeners, map) { return listeners.concat(Array.from(map.values())); }, []);
            },
            enumerable: true,
            configurable: true
        });
        // Binding observer delegate
        /** @hidden */
        Dispatcher.prototype.bindingConnected = function (binding) {
            this.fetchEventListenerForBinding(binding).bindingConnected(binding);
        };
        /** @hidden */
        Dispatcher.prototype.bindingDisconnected = function (binding) {
            this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
        };
        // Error handling
        Dispatcher.prototype.handleError = function (error, message, detail) {
            if (detail === void 0) { detail = {}; }
            this.application.handleError(error, "Error " + message, detail);
        };
        Dispatcher.prototype.fetchEventListenerForBinding = function (binding) {
            var eventTarget = binding.eventTarget, eventName = binding.eventName;
            return this.fetchEventListener(eventTarget, eventName);
        };
        Dispatcher.prototype.fetchEventListener = function (eventTarget, eventName) {
            var eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
            var eventListener = eventListenerMap.get(eventName);
            if (!eventListener) {
                eventListener = this.createEventListener(eventTarget, eventName);
                eventListenerMap.set(eventName, eventListener);
            }
            return eventListener;
        };
        Dispatcher.prototype.createEventListener = function (eventTarget, eventName) {
            var eventListener = new EventListener(eventTarget, eventName);
            if (this.started) {
                eventListener.connect();
            }
            return eventListener;
        };
        Dispatcher.prototype.fetchEventListenerMapForEventTarget = function (eventTarget) {
            var eventListenerMap = this.eventListenerMaps.get(eventTarget);
            if (!eventListenerMap) {
                eventListenerMap = new Map;
                this.eventListenerMaps.set(eventTarget, eventListenerMap);
            }
            return eventListenerMap;
        };
        return Dispatcher;
    }());

    // capture nos.:            12   23 4               43   1 5   56 7  76
    var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#(.+))?$/;
    function parseDescriptorString(descriptorString) {
        var source = descriptorString.trim();
        var matches = source.match(descriptorPattern) || [];
        return {
            eventTarget: parseEventTarget(matches[4]),
            eventName: matches[2],
            identifier: matches[5],
            methodName: matches[7]
        };
    }
    function parseEventTarget(eventTargetName) {
        if (eventTargetName == "window") {
            return window;
        }
        else if (eventTargetName == "document") {
            return document;
        }
    }
    function stringifyEventTarget(eventTarget) {
        if (eventTarget == window) {
            return "window";
        }
        else if (eventTarget == document) {
            return "document";
        }
    }

    var Action = /** @class */ (function () {
        function Action(element, index, descriptor) {
            this.element = element;
            this.index = index;
            this.eventTarget = descriptor.eventTarget || element;
            this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error$2("missing event name");
            this.identifier = descriptor.identifier || error$2("missing identifier");
            this.methodName = descriptor.methodName || error$2("missing method name");
        }
        Action.forToken = function (token) {
            return new this(token.element, token.index, parseDescriptorString(token.content));
        };
        Action.prototype.toString = function () {
            var eventNameSuffix = this.eventTargetName ? "@" + this.eventTargetName : "";
            return "" + this.eventName + eventNameSuffix + "->" + this.identifier + "#" + this.methodName;
        };
        Object.defineProperty(Action.prototype, "eventTargetName", {
            get: function () {
                return stringifyEventTarget(this.eventTarget);
            },
            enumerable: true,
            configurable: true
        });
        return Action;
    }());
    var defaultEventNames = {
        "a": function (e) { return "click"; },
        "button": function (e) { return "click"; },
        "form": function (e) { return "submit"; },
        "input": function (e) { return e.getAttribute("type") == "submit" ? "click" : "change"; },
        "select": function (e) { return "change"; },
        "textarea": function (e) { return "change"; }
    };
    function getDefaultEventNameForElement(element) {
        var tagName = element.tagName.toLowerCase();
        if (tagName in defaultEventNames) {
            return defaultEventNames[tagName](element);
        }
    }
    function error$2(message) {
        throw new Error(message);
    }

    var Binding = /** @class */ (function () {
        function Binding(context, action) {
            this.context = context;
            this.action = action;
        }
        Object.defineProperty(Binding.prototype, "index", {
            get: function () {
                return this.action.index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "eventTarget", {
            get: function () {
                return this.action.eventTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "identifier", {
            get: function () {
                return this.context.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Binding.prototype.handleEvent = function (event) {
            if (this.willBeInvokedByEvent(event)) {
                this.invokeWithEvent(event);
            }
        };
        Object.defineProperty(Binding.prototype, "eventName", {
            get: function () {
                return this.action.eventName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "method", {
            get: function () {
                var method = this.controller[this.methodName];
                if (typeof method == "function") {
                    return method;
                }
                throw new Error("Action \"" + this.action + "\" references undefined method \"" + this.methodName + "\"");
            },
            enumerable: true,
            configurable: true
        });
        Binding.prototype.invokeWithEvent = function (event) {
            try {
                this.method.call(this.controller, event);
            }
            catch (error) {
                var _a = this, identifier = _a.identifier, controller = _a.controller, element = _a.element, index = _a.index;
                var detail = { identifier: identifier, controller: controller, element: element, index: index, event: event };
                this.context.handleError(error, "invoking action \"" + this.action + "\"", detail);
            }
        };
        Binding.prototype.willBeInvokedByEvent = function (event) {
            var eventTarget = event.target;
            if (this.element === eventTarget) {
                return true;
            }
            else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
                return this.scope.containsElement(eventTarget);
            }
            else {
                return true;
            }
        };
        Object.defineProperty(Binding.prototype, "controller", {
            get: function () {
                return this.context.controller;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "methodName", {
            get: function () {
                return this.action.methodName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "element", {
            get: function () {
                return this.scope.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "scope", {
            get: function () {
                return this.context.scope;
            },
            enumerable: true,
            configurable: true
        });
        return Binding;
    }());

    var ElementObserver = /** @class */ (function () {
        function ElementObserver(element, delegate) {
            var _this = this;
            this.element = element;
            this.started = false;
            this.delegate = delegate;
            this.elements = new Set;
            this.mutationObserver = new MutationObserver(function (mutations) { return _this.processMutations(mutations); });
        }
        ElementObserver.prototype.start = function () {
            if (!this.started) {
                this.started = true;
                this.mutationObserver.observe(this.element, { attributes: true, childList: true, subtree: true });
                this.refresh();
            }
        };
        ElementObserver.prototype.stop = function () {
            if (this.started) {
                this.mutationObserver.takeRecords();
                this.mutationObserver.disconnect();
                this.started = false;
            }
        };
        ElementObserver.prototype.refresh = function () {
            if (this.started) {
                var matches = new Set(this.matchElementsInTree());
                for (var _i = 0, _a = Array.from(this.elements); _i < _a.length; _i++) {
                    var element = _a[_i];
                    if (!matches.has(element)) {
                        this.removeElement(element);
                    }
                }
                for (var _b = 0, _c = Array.from(matches); _b < _c.length; _b++) {
                    var element = _c[_b];
                    this.addElement(element);
                }
            }
        };
        // Mutation record processing
        ElementObserver.prototype.processMutations = function (mutations) {
            if (this.started) {
                for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                    var mutation = mutations_1[_i];
                    this.processMutation(mutation);
                }
            }
        };
        ElementObserver.prototype.processMutation = function (mutation) {
            if (mutation.type == "attributes") {
                this.processAttributeChange(mutation.target, mutation.attributeName);
            }
            else if (mutation.type == "childList") {
                this.processRemovedNodes(mutation.removedNodes);
                this.processAddedNodes(mutation.addedNodes);
            }
        };
        ElementObserver.prototype.processAttributeChange = function (node, attributeName) {
            var element = node;
            if (this.elements.has(element)) {
                if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                    this.delegate.elementAttributeChanged(element, attributeName);
                }
                else {
                    this.removeElement(element);
                }
            }
            else if (this.matchElement(element)) {
                this.addElement(element);
            }
        };
        ElementObserver.prototype.processRemovedNodes = function (nodes) {
            for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
                var node = _a[_i];
                var element = this.elementFromNode(node);
                if (element) {
                    this.processTree(element, this.removeElement);
                }
            }
        };
        ElementObserver.prototype.processAddedNodes = function (nodes) {
            for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
                var node = _a[_i];
                var element = this.elementFromNode(node);
                if (element && this.elementIsActive(element)) {
                    this.processTree(element, this.addElement);
                }
            }
        };
        // Element matching
        ElementObserver.prototype.matchElement = function (element) {
            return this.delegate.matchElement(element);
        };
        ElementObserver.prototype.matchElementsInTree = function (tree) {
            if (tree === void 0) { tree = this.element; }
            return this.delegate.matchElementsInTree(tree);
        };
        ElementObserver.prototype.processTree = function (tree, processor) {
            for (var _i = 0, _a = this.matchElementsInTree(tree); _i < _a.length; _i++) {
                var element = _a[_i];
                processor.call(this, element);
            }
        };
        ElementObserver.prototype.elementFromNode = function (node) {
            if (node.nodeType == Node.ELEMENT_NODE) {
                return node;
            }
        };
        ElementObserver.prototype.elementIsActive = function (element) {
            if (element.isConnected != this.element.isConnected) {
                return false;
            }
            else {
                return this.element.contains(element);
            }
        };
        // Element tracking
        ElementObserver.prototype.addElement = function (element) {
            if (!this.elements.has(element)) {
                if (this.elementIsActive(element)) {
                    this.elements.add(element);
                    if (this.delegate.elementMatched) {
                        this.delegate.elementMatched(element);
                    }
                }
            }
        };
        ElementObserver.prototype.removeElement = function (element) {
            if (this.elements.has(element)) {
                this.elements.delete(element);
                if (this.delegate.elementUnmatched) {
                    this.delegate.elementUnmatched(element);
                }
            }
        };
        return ElementObserver;
    }());

    var AttributeObserver = /** @class */ (function () {
        function AttributeObserver(element, attributeName, delegate) {
            this.attributeName = attributeName;
            this.delegate = delegate;
            this.elementObserver = new ElementObserver(element, this);
        }
        Object.defineProperty(AttributeObserver.prototype, "element", {
            get: function () {
                return this.elementObserver.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeObserver.prototype, "selector", {
            get: function () {
                return "[" + this.attributeName + "]";
            },
            enumerable: true,
            configurable: true
        });
        AttributeObserver.prototype.start = function () {
            this.elementObserver.start();
        };
        AttributeObserver.prototype.stop = function () {
            this.elementObserver.stop();
        };
        AttributeObserver.prototype.refresh = function () {
            this.elementObserver.refresh();
        };
        Object.defineProperty(AttributeObserver.prototype, "started", {
            get: function () {
                return this.elementObserver.started;
            },
            enumerable: true,
            configurable: true
        });
        // Element observer delegate
        AttributeObserver.prototype.matchElement = function (element) {
            return element.hasAttribute(this.attributeName);
        };
        AttributeObserver.prototype.matchElementsInTree = function (tree) {
            var match = this.matchElement(tree) ? [tree] : [];
            var matches = Array.from(tree.querySelectorAll(this.selector));
            return match.concat(matches);
        };
        AttributeObserver.prototype.elementMatched = function (element) {
            if (this.delegate.elementMatchedAttribute) {
                this.delegate.elementMatchedAttribute(element, this.attributeName);
            }
        };
        AttributeObserver.prototype.elementUnmatched = function (element) {
            if (this.delegate.elementUnmatchedAttribute) {
                this.delegate.elementUnmatchedAttribute(element, this.attributeName);
            }
        };
        AttributeObserver.prototype.elementAttributeChanged = function (element, attributeName) {
            if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
                this.delegate.elementAttributeValueChanged(element, attributeName);
            }
        };
        return AttributeObserver;
    }());

    function add(map, key, value) {
        fetch$1(map, key).add(value);
    }
    function del(map, key, value) {
        fetch$1(map, key).delete(value);
        prune(map, key);
    }
    function fetch$1(map, key) {
        var values = map.get(key);
        if (!values) {
            values = new Set();
            map.set(key, values);
        }
        return values;
    }
    function prune(map, key) {
        var values = map.get(key);
        if (values != null && values.size == 0) {
            map.delete(key);
        }
    }

    var Multimap = /** @class */ (function () {
        function Multimap() {
            this.valuesByKey = new Map();
        }
        Object.defineProperty(Multimap.prototype, "values", {
            get: function () {
                var sets = Array.from(this.valuesByKey.values());
                return sets.reduce(function (values, set) { return values.concat(Array.from(set)); }, []);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Multimap.prototype, "size", {
            get: function () {
                var sets = Array.from(this.valuesByKey.values());
                return sets.reduce(function (size, set) { return size + set.size; }, 0);
            },
            enumerable: true,
            configurable: true
        });
        Multimap.prototype.add = function (key, value) {
            add(this.valuesByKey, key, value);
        };
        Multimap.prototype.delete = function (key, value) {
            del(this.valuesByKey, key, value);
        };
        Multimap.prototype.has = function (key, value) {
            var values = this.valuesByKey.get(key);
            return values != null && values.has(value);
        };
        Multimap.prototype.hasKey = function (key) {
            return this.valuesByKey.has(key);
        };
        Multimap.prototype.hasValue = function (value) {
            var sets = Array.from(this.valuesByKey.values());
            return sets.some(function (set) { return set.has(value); });
        };
        Multimap.prototype.getValuesForKey = function (key) {
            var values = this.valuesByKey.get(key);
            return values ? Array.from(values) : [];
        };
        Multimap.prototype.getKeysForValue = function (value) {
            return Array.from(this.valuesByKey)
                .filter(function (_a) {
                var key = _a[0], values = _a[1];
                return values.has(value);
            })
                .map(function (_a) {
                var key = _a[0], values = _a[1];
                return key;
            });
        };
        return Multimap;
    }());

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var IndexedMultimap = /** @class */ (function (_super) {
        __extends(IndexedMultimap, _super);
        function IndexedMultimap() {
            var _this = _super.call(this) || this;
            _this.keysByValue = new Map;
            return _this;
        }
        Object.defineProperty(IndexedMultimap.prototype, "values", {
            get: function () {
                return Array.from(this.keysByValue.keys());
            },
            enumerable: true,
            configurable: true
        });
        IndexedMultimap.prototype.add = function (key, value) {
            _super.prototype.add.call(this, key, value);
            add(this.keysByValue, value, key);
        };
        IndexedMultimap.prototype.delete = function (key, value) {
            _super.prototype.delete.call(this, key, value);
            del(this.keysByValue, value, key);
        };
        IndexedMultimap.prototype.hasValue = function (value) {
            return this.keysByValue.has(value);
        };
        IndexedMultimap.prototype.getKeysForValue = function (value) {
            var set = this.keysByValue.get(value);
            return set ? Array.from(set) : [];
        };
        return IndexedMultimap;
    }(Multimap));

    var TokenListObserver = /** @class */ (function () {
        function TokenListObserver(element, attributeName, delegate) {
            this.attributeObserver = new AttributeObserver(element, attributeName, this);
            this.delegate = delegate;
            this.tokensByElement = new Multimap;
        }
        Object.defineProperty(TokenListObserver.prototype, "started", {
            get: function () {
                return this.attributeObserver.started;
            },
            enumerable: true,
            configurable: true
        });
        TokenListObserver.prototype.start = function () {
            this.attributeObserver.start();
        };
        TokenListObserver.prototype.stop = function () {
            this.attributeObserver.stop();
        };
        TokenListObserver.prototype.refresh = function () {
            this.attributeObserver.refresh();
        };
        Object.defineProperty(TokenListObserver.prototype, "element", {
            get: function () {
                return this.attributeObserver.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TokenListObserver.prototype, "attributeName", {
            get: function () {
                return this.attributeObserver.attributeName;
            },
            enumerable: true,
            configurable: true
        });
        // Attribute observer delegate
        TokenListObserver.prototype.elementMatchedAttribute = function (element) {
            this.tokensMatched(this.readTokensForElement(element));
        };
        TokenListObserver.prototype.elementAttributeValueChanged = function (element) {
            var _a = this.refreshTokensForElement(element), unmatchedTokens = _a[0], matchedTokens = _a[1];
            this.tokensUnmatched(unmatchedTokens);
            this.tokensMatched(matchedTokens);
        };
        TokenListObserver.prototype.elementUnmatchedAttribute = function (element) {
            this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
        };
        TokenListObserver.prototype.tokensMatched = function (tokens) {
            var _this = this;
            tokens.forEach(function (token) { return _this.tokenMatched(token); });
        };
        TokenListObserver.prototype.tokensUnmatched = function (tokens) {
            var _this = this;
            tokens.forEach(function (token) { return _this.tokenUnmatched(token); });
        };
        TokenListObserver.prototype.tokenMatched = function (token) {
            this.delegate.tokenMatched(token);
            this.tokensByElement.add(token.element, token);
        };
        TokenListObserver.prototype.tokenUnmatched = function (token) {
            this.delegate.tokenUnmatched(token);
            this.tokensByElement.delete(token.element, token);
        };
        TokenListObserver.prototype.refreshTokensForElement = function (element) {
            var previousTokens = this.tokensByElement.getValuesForKey(element);
            var currentTokens = this.readTokensForElement(element);
            var firstDifferingIndex = zip(previousTokens, currentTokens)
                .findIndex(function (_a) {
                var previousToken = _a[0], currentToken = _a[1];
                return !tokensAreEqual(previousToken, currentToken);
            });
            if (firstDifferingIndex == -1) {
                return [[], []];
            }
            else {
                return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
            }
        };
        TokenListObserver.prototype.readTokensForElement = function (element) {
            var attributeName = this.attributeName;
            var tokenString = element.getAttribute(attributeName) || "";
            return parseTokenString(tokenString, element, attributeName);
        };
        return TokenListObserver;
    }());
    function parseTokenString(tokenString, element, attributeName) {
        return tokenString.trim().split(/\s+/).filter(function (content) { return content.length; })
            .map(function (content, index) { return ({ element: element, attributeName: attributeName, content: content, index: index }); });
    }
    function zip(left, right) {
        var length = Math.max(left.length, right.length);
        return Array.from({ length: length }, function (_, index) { return [left[index], right[index]]; });
    }
    function tokensAreEqual(left, right) {
        return left && right && left.index == right.index && left.content == right.content;
    }

    var ValueListObserver = /** @class */ (function () {
        function ValueListObserver(element, attributeName, delegate) {
            this.tokenListObserver = new TokenListObserver(element, attributeName, this);
            this.delegate = delegate;
            this.parseResultsByToken = new WeakMap;
            this.valuesByTokenByElement = new WeakMap;
        }
        Object.defineProperty(ValueListObserver.prototype, "started", {
            get: function () {
                return this.tokenListObserver.started;
            },
            enumerable: true,
            configurable: true
        });
        ValueListObserver.prototype.start = function () {
            this.tokenListObserver.start();
        };
        ValueListObserver.prototype.stop = function () {
            this.tokenListObserver.stop();
        };
        ValueListObserver.prototype.refresh = function () {
            this.tokenListObserver.refresh();
        };
        Object.defineProperty(ValueListObserver.prototype, "element", {
            get: function () {
                return this.tokenListObserver.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueListObserver.prototype, "attributeName", {
            get: function () {
                return this.tokenListObserver.attributeName;
            },
            enumerable: true,
            configurable: true
        });
        ValueListObserver.prototype.tokenMatched = function (token) {
            var element = token.element;
            var value = this.fetchParseResultForToken(token).value;
            if (value) {
                this.fetchValuesByTokenForElement(element).set(token, value);
                this.delegate.elementMatchedValue(element, value);
            }
        };
        ValueListObserver.prototype.tokenUnmatched = function (token) {
            var element = token.element;
            var value = this.fetchParseResultForToken(token).value;
            if (value) {
                this.fetchValuesByTokenForElement(element).delete(token);
                this.delegate.elementUnmatchedValue(element, value);
            }
        };
        ValueListObserver.prototype.fetchParseResultForToken = function (token) {
            var parseResult = this.parseResultsByToken.get(token);
            if (!parseResult) {
                parseResult = this.parseToken(token);
                this.parseResultsByToken.set(token, parseResult);
            }
            return parseResult;
        };
        ValueListObserver.prototype.fetchValuesByTokenForElement = function (element) {
            var valuesByToken = this.valuesByTokenByElement.get(element);
            if (!valuesByToken) {
                valuesByToken = new Map;
                this.valuesByTokenByElement.set(element, valuesByToken);
            }
            return valuesByToken;
        };
        ValueListObserver.prototype.parseToken = function (token) {
            try {
                var value = this.delegate.parseValueForToken(token);
                return { value: value };
            }
            catch (error) {
                return { error: error };
            }
        };
        return ValueListObserver;
    }());

    var BindingObserver = /** @class */ (function () {
        function BindingObserver(context, delegate) {
            this.context = context;
            this.delegate = delegate;
            this.bindingsByAction = new Map;
        }
        BindingObserver.prototype.start = function () {
            if (!this.valueListObserver) {
                this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
                this.valueListObserver.start();
            }
        };
        BindingObserver.prototype.stop = function () {
            if (this.valueListObserver) {
                this.valueListObserver.stop();
                delete this.valueListObserver;
                this.disconnectAllActions();
            }
        };
        Object.defineProperty(BindingObserver.prototype, "element", {
            get: function () {
                return this.context.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BindingObserver.prototype, "identifier", {
            get: function () {
                return this.context.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BindingObserver.prototype, "actionAttribute", {
            get: function () {
                return this.schema.actionAttribute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BindingObserver.prototype, "schema", {
            get: function () {
                return this.context.schema;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BindingObserver.prototype, "bindings", {
            get: function () {
                return Array.from(this.bindingsByAction.values());
            },
            enumerable: true,
            configurable: true
        });
        BindingObserver.prototype.connectAction = function (action) {
            var binding = new Binding(this.context, action);
            this.bindingsByAction.set(action, binding);
            this.delegate.bindingConnected(binding);
        };
        BindingObserver.prototype.disconnectAction = function (action) {
            var binding = this.bindingsByAction.get(action);
            if (binding) {
                this.bindingsByAction.delete(action);
                this.delegate.bindingDisconnected(binding);
            }
        };
        BindingObserver.prototype.disconnectAllActions = function () {
            var _this = this;
            this.bindings.forEach(function (binding) { return _this.delegate.bindingDisconnected(binding); });
            this.bindingsByAction.clear();
        };
        // Value observer delegate
        BindingObserver.prototype.parseValueForToken = function (token) {
            var action = Action.forToken(token);
            if (action.identifier == this.identifier) {
                return action;
            }
        };
        BindingObserver.prototype.elementMatchedValue = function (element, action) {
            this.connectAction(action);
        };
        BindingObserver.prototype.elementUnmatchedValue = function (element, action) {
            this.disconnectAction(action);
        };
        return BindingObserver;
    }());

    var Context = /** @class */ (function () {
        function Context(module, scope) {
            this.module = module;
            this.scope = scope;
            this.controller = new module.controllerConstructor(this);
            this.bindingObserver = new BindingObserver(this, this.dispatcher);
            try {
                this.controller.initialize();
            }
            catch (error) {
                this.handleError(error, "initializing controller");
            }
        }
        Context.prototype.connect = function () {
            this.bindingObserver.start();
            try {
                this.controller.connect();
            }
            catch (error) {
                this.handleError(error, "connecting controller");
            }
        };
        Context.prototype.disconnect = function () {
            try {
                this.controller.disconnect();
            }
            catch (error) {
                this.handleError(error, "disconnecting controller");
            }
            this.bindingObserver.stop();
        };
        Object.defineProperty(Context.prototype, "application", {
            get: function () {
                return this.module.application;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "identifier", {
            get: function () {
                return this.module.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "schema", {
            get: function () {
                return this.application.schema;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "dispatcher", {
            get: function () {
                return this.application.dispatcher;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "element", {
            get: function () {
                return this.scope.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Context.prototype, "parentElement", {
            get: function () {
                return this.element.parentElement;
            },
            enumerable: true,
            configurable: true
        });
        // Error handling
        Context.prototype.handleError = function (error, message, detail) {
            if (detail === void 0) { detail = {}; }
            var _a = this, identifier = _a.identifier, controller = _a.controller, element = _a.element;
            detail = Object.assign({ identifier: identifier, controller: controller, element: element }, detail);
            this.application.handleError(error, "Error " + message, detail);
        };
        return Context;
    }());

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** @hidden */
    function blessDefinition(definition) {
        return {
            identifier: definition.identifier,
            controllerConstructor: blessControllerConstructor(definition.controllerConstructor)
        };
    }
    function blessControllerConstructor(controllerConstructor) {
        var constructor = extend(controllerConstructor);
        constructor.bless();
        return constructor;
    }
    var extend = (function () {
        function extendWithReflect(constructor) {
            function Controller() {
                var _newTarget = this && this instanceof Controller ? this.constructor : void 0;
                return Reflect.construct(constructor, arguments, _newTarget);
            }
            Controller.prototype = Object.create(constructor.prototype, {
                constructor: { value: Controller }
            });
            Reflect.setPrototypeOf(Controller, constructor);
            return Controller;
        }
        function testReflectExtension() {
            var a = function () { this.a.call(this); };
            var b = extendWithReflect(a);
            b.prototype.a = function () { };
            return new b;
        }
        try {
            testReflectExtension();
            return extendWithReflect;
        }
        catch (error) {
            return function (constructor) { return /** @class */ (function (_super) {
                __extends$1(Controller, _super);
                function Controller() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Controller;
            }(constructor)); };
        }
    })();

    var Module = /** @class */ (function () {
        function Module(application, definition) {
            this.application = application;
            this.definition = blessDefinition(definition);
            this.contextsByScope = new WeakMap;
            this.connectedContexts = new Set;
        }
        Object.defineProperty(Module.prototype, "identifier", {
            get: function () {
                return this.definition.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Module.prototype, "controllerConstructor", {
            get: function () {
                return this.definition.controllerConstructor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Module.prototype, "contexts", {
            get: function () {
                return Array.from(this.connectedContexts);
            },
            enumerable: true,
            configurable: true
        });
        Module.prototype.connectContextForScope = function (scope) {
            var context = this.fetchContextForScope(scope);
            this.connectedContexts.add(context);
            context.connect();
        };
        Module.prototype.disconnectContextForScope = function (scope) {
            var context = this.contextsByScope.get(scope);
            if (context) {
                this.connectedContexts.delete(context);
                context.disconnect();
            }
        };
        Module.prototype.fetchContextForScope = function (scope) {
            var context = this.contextsByScope.get(scope);
            if (!context) {
                context = new Context(this, scope);
                this.contextsByScope.set(scope, context);
            }
            return context;
        };
        return Module;
    }());

    var DataMap = /** @class */ (function () {
        function DataMap(scope) {
            this.scope = scope;
        }
        Object.defineProperty(DataMap.prototype, "element", {
            get: function () {
                return this.scope.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataMap.prototype, "identifier", {
            get: function () {
                return this.scope.identifier;
            },
            enumerable: true,
            configurable: true
        });
        DataMap.prototype.get = function (key) {
            key = this.getFormattedKey(key);
            return this.element.getAttribute(key);
        };
        DataMap.prototype.set = function (key, value) {
            key = this.getFormattedKey(key);
            this.element.setAttribute(key, value);
            return this.get(key);
        };
        DataMap.prototype.has = function (key) {
            key = this.getFormattedKey(key);
            return this.element.hasAttribute(key);
        };
        DataMap.prototype.delete = function (key) {
            if (this.has(key)) {
                key = this.getFormattedKey(key);
                this.element.removeAttribute(key);
                return true;
            }
            else {
                return false;
            }
        };
        DataMap.prototype.getFormattedKey = function (key) {
            return "data-" + this.identifier + "-" + dasherize(key);
        };
        return DataMap;
    }());
    function dasherize(value) {
        return value.replace(/([A-Z])/g, function (_, char) { return "-" + char.toLowerCase(); });
    }

    /** @hidden */
    function attributeValueContainsToken(attributeName, token) {
        return "[" + attributeName + "~=\"" + token + "\"]";
    }

    var TargetSet = /** @class */ (function () {
        function TargetSet(scope) {
            this.scope = scope;
        }
        Object.defineProperty(TargetSet.prototype, "element", {
            get: function () {
                return this.scope.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TargetSet.prototype, "identifier", {
            get: function () {
                return this.scope.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TargetSet.prototype, "schema", {
            get: function () {
                return this.scope.schema;
            },
            enumerable: true,
            configurable: true
        });
        TargetSet.prototype.has = function (targetName) {
            return this.find(targetName) != null;
        };
        TargetSet.prototype.find = function () {
            var targetNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                targetNames[_i] = arguments[_i];
            }
            var selector = this.getSelectorForTargetNames(targetNames);
            return this.scope.findElement(selector);
        };
        TargetSet.prototype.findAll = function () {
            var targetNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                targetNames[_i] = arguments[_i];
            }
            var selector = this.getSelectorForTargetNames(targetNames);
            return this.scope.findAllElements(selector);
        };
        TargetSet.prototype.getSelectorForTargetNames = function (targetNames) {
            var _this = this;
            return targetNames.map(function (targetName) { return _this.getSelectorForTargetName(targetName); }).join(", ");
        };
        TargetSet.prototype.getSelectorForTargetName = function (targetName) {
            var targetDescriptor = this.identifier + "." + targetName;
            return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
        };
        return TargetSet;
    }());

    var Scope = /** @class */ (function () {
        function Scope(schema, identifier, element) {
            this.schema = schema;
            this.identifier = identifier;
            this.element = element;
            this.targets = new TargetSet(this);
            this.data = new DataMap(this);
        }
        Scope.prototype.findElement = function (selector) {
            return this.findAllElements(selector)[0];
        };
        Scope.prototype.findAllElements = function (selector) {
            var head = this.element.matches(selector) ? [this.element] : [];
            var tail = this.filterElements(Array.from(this.element.querySelectorAll(selector)));
            return head.concat(tail);
        };
        Scope.prototype.filterElements = function (elements) {
            var _this = this;
            return elements.filter(function (element) { return _this.containsElement(element); });
        };
        Scope.prototype.containsElement = function (element) {
            return element.closest(this.controllerSelector) === this.element;
        };
        Object.defineProperty(Scope.prototype, "controllerSelector", {
            get: function () {
                return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
            },
            enumerable: true,
            configurable: true
        });
        return Scope;
    }());

    var ScopeObserver = /** @class */ (function () {
        function ScopeObserver(element, schema, delegate) {
            this.element = element;
            this.schema = schema;
            this.delegate = delegate;
            this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
            this.scopesByIdentifierByElement = new WeakMap;
            this.scopeReferenceCounts = new WeakMap;
        }
        ScopeObserver.prototype.start = function () {
            this.valueListObserver.start();
        };
        ScopeObserver.prototype.stop = function () {
            this.valueListObserver.stop();
        };
        Object.defineProperty(ScopeObserver.prototype, "controllerAttribute", {
            get: function () {
                return this.schema.controllerAttribute;
            },
            enumerable: true,
            configurable: true
        });
        // Value observer delegate
        /** @hidden */
        ScopeObserver.prototype.parseValueForToken = function (token) {
            var element = token.element, identifier = token.content;
            var scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
            var scope = scopesByIdentifier.get(identifier);
            if (!scope) {
                scope = new Scope(this.schema, identifier, element);
                scopesByIdentifier.set(identifier, scope);
            }
            return scope;
        };
        /** @hidden */
        ScopeObserver.prototype.elementMatchedValue = function (element, value) {
            var referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
            this.scopeReferenceCounts.set(value, referenceCount);
            if (referenceCount == 1) {
                this.delegate.scopeConnected(value);
            }
        };
        /** @hidden */
        ScopeObserver.prototype.elementUnmatchedValue = function (element, value) {
            var referenceCount = this.scopeReferenceCounts.get(value);
            if (referenceCount) {
                this.scopeReferenceCounts.set(value, referenceCount - 1);
                if (referenceCount == 1) {
                    this.delegate.scopeDisconnected(value);
                }
            }
        };
        ScopeObserver.prototype.fetchScopesByIdentifierForElement = function (element) {
            var scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
            if (!scopesByIdentifier) {
                scopesByIdentifier = new Map;
                this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
            }
            return scopesByIdentifier;
        };
        return ScopeObserver;
    }());

    var Router = /** @class */ (function () {
        function Router(application) {
            this.application = application;
            this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
            this.scopesByIdentifier = new Multimap;
            this.modulesByIdentifier = new Map;
        }
        Object.defineProperty(Router.prototype, "element", {
            get: function () {
                return this.application.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "schema", {
            get: function () {
                return this.application.schema;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "controllerAttribute", {
            get: function () {
                return this.schema.controllerAttribute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "modules", {
            get: function () {
                return Array.from(this.modulesByIdentifier.values());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "contexts", {
            get: function () {
                return this.modules.reduce(function (contexts, module) { return contexts.concat(module.contexts); }, []);
            },
            enumerable: true,
            configurable: true
        });
        Router.prototype.start = function () {
            this.scopeObserver.start();
        };
        Router.prototype.stop = function () {
            this.scopeObserver.stop();
        };
        Router.prototype.loadDefinition = function (definition) {
            this.unloadIdentifier(definition.identifier);
            var module = new Module(this.application, definition);
            this.connectModule(module);
        };
        Router.prototype.unloadIdentifier = function (identifier) {
            var module = this.modulesByIdentifier.get(identifier);
            if (module) {
                this.disconnectModule(module);
            }
        };
        Router.prototype.getContextForElementAndIdentifier = function (element, identifier) {
            var module = this.modulesByIdentifier.get(identifier);
            if (module) {
                return module.contexts.find(function (context) { return context.element == element; });
            }
        };
        // Error handler delegate
        /** @hidden */
        Router.prototype.handleError = function (error, message, detail) {
            this.application.handleError(error, message, detail);
        };
        // Scope observer delegate
        /** @hidden */
        Router.prototype.scopeConnected = function (scope) {
            this.scopesByIdentifier.add(scope.identifier, scope);
            var module = this.modulesByIdentifier.get(scope.identifier);
            if (module) {
                module.connectContextForScope(scope);
            }
        };
        /** @hidden */
        Router.prototype.scopeDisconnected = function (scope) {
            this.scopesByIdentifier.delete(scope.identifier, scope);
            var module = this.modulesByIdentifier.get(scope.identifier);
            if (module) {
                module.disconnectContextForScope(scope);
            }
        };
        // Modules
        Router.prototype.connectModule = function (module) {
            this.modulesByIdentifier.set(module.identifier, module);
            var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
            scopes.forEach(function (scope) { return module.connectContextForScope(scope); });
        };
        Router.prototype.disconnectModule = function (module) {
            this.modulesByIdentifier.delete(module.identifier);
            var scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
            scopes.forEach(function (scope) { return module.disconnectContextForScope(scope); });
        };
        return Router;
    }());

    var defaultSchema = {
        controllerAttribute: "data-controller",
        actionAttribute: "data-action",
        targetAttribute: "data-target"
    };

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Application = /** @class */ (function () {
        function Application(element, schema) {
            if (element === void 0) { element = document.documentElement; }
            if (schema === void 0) { schema = defaultSchema; }
            this.element = element;
            this.schema = schema;
            this.dispatcher = new Dispatcher(this);
            this.router = new Router(this);
        }
        Application.start = function (element, schema) {
            var application = new Application(element, schema);
            application.start();
            return application;
        };
        Application.prototype.start = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, domReady()];
                        case 1:
                            _a.sent();
                            this.router.start();
                            this.dispatcher.start();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Application.prototype.stop = function () {
            this.router.stop();
            this.dispatcher.stop();
        };
        Application.prototype.register = function (identifier, controllerConstructor) {
            this.load({ identifier: identifier, controllerConstructor: controllerConstructor });
        };
        Application.prototype.load = function (head) {
            var _this = this;
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var definitions = Array.isArray(head) ? head : [head].concat(rest);
            definitions.forEach(function (definition) { return _this.router.loadDefinition(definition); });
        };
        Application.prototype.unload = function (head) {
            var _this = this;
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var identifiers = Array.isArray(head) ? head : [head].concat(rest);
            identifiers.forEach(function (identifier) { return _this.router.unloadIdentifier(identifier); });
        };
        Object.defineProperty(Application.prototype, "controllers", {
            // Controllers
            get: function () {
                return this.router.contexts.map(function (context) { return context.controller; });
            },
            enumerable: true,
            configurable: true
        });
        Application.prototype.getControllerForElementAndIdentifier = function (element, identifier) {
            var context = this.router.getContextForElementAndIdentifier(element, identifier);
            return context ? context.controller : null;
        };
        // Error handling
        Application.prototype.handleError = function (error, message, detail) {
            console.error("%s\n\n%o\n\n%o", message, error, detail);
        };
        return Application;
    }());
    function domReady() {
        return new Promise(function (resolve) {
            if (document.readyState == "loading") {
                document.addEventListener("DOMContentLoaded", resolve);
            }
            else {
                resolve();
            }
        });
    }

    /** @hidden */
    function defineTargetProperties(constructor) {
        var prototype = constructor.prototype;
        var targetNames = getTargetNamesForConstructor(constructor);
        targetNames.forEach(function (name) {
            var _a;
            return defineLinkedProperties(prototype, (_a = {},
                _a[name + "Target"] = {
                    get: function () {
                        var target = this.targets.find(name);
                        if (target) {
                            return target;
                        }
                        else {
                            throw new Error("Missing target element \"" + this.identifier + "." + name + "\"");
                        }
                    }
                },
                _a[name + "Targets"] = {
                    get: function () {
                        return this.targets.findAll(name);
                    }
                },
                _a["has" + capitalize(name) + "Target"] = {
                    get: function () {
                        return this.targets.has(name);
                    }
                },
                _a));
        });
    }
    function getTargetNamesForConstructor(constructor) {
        var ancestors = getAncestorsForConstructor(constructor);
        return Array.from(ancestors.reduce(function (targetNames, constructor) {
            getOwnTargetNamesForConstructor(constructor).forEach(function (name) { return targetNames.add(name); });
            return targetNames;
        }, new Set));
    }
    function getAncestorsForConstructor(constructor) {
        var ancestors = [];
        while (constructor) {
            ancestors.push(constructor);
            constructor = Object.getPrototypeOf(constructor);
        }
        return ancestors;
    }
    function getOwnTargetNamesForConstructor(constructor) {
        var definition = constructor["targets"];
        return Array.isArray(definition) ? definition : [];
    }
    function defineLinkedProperties(object, properties) {
        Object.keys(properties).forEach(function (name) {
            if (!(name in object)) {
                var descriptor = properties[name];
                Object.defineProperty(object, name, descriptor);
            }
        });
    }
    function capitalize(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    var Controller = /** @class */ (function () {
        function Controller(context) {
            this.context = context;
        }
        Controller.bless = function () {
            defineTargetProperties(this);
        };
        Object.defineProperty(Controller.prototype, "application", {
            get: function () {
                return this.context.application;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "scope", {
            get: function () {
                return this.context.scope;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "element", {
            get: function () {
                return this.scope.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "identifier", {
            get: function () {
                return this.scope.identifier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "targets", {
            get: function () {
                return this.scope.targets;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "data", {
            get: function () {
                return this.scope.data;
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.initialize = function () {
            // Override in your subclass to set up initial controller state
        };
        Controller.prototype.connect = function () {
            // Override in your subclass to respond when the controller is connected to the DOM
        };
        Controller.prototype.disconnect = function () {
            // Override in your subclass to respond when the controller is disconnected from the DOM
        };
        Controller.targets = [];
        return Controller;
    }());

    const urlShortenerMachineConfig = {
        id: "urlShortener",
        initial: "idle",
        context: {},
        states: {
            idle: {
                on: {
                    // CHANGE: "changed",
                    SHORTEN: [
                        { target: "shortening", cond: "isValidURL" },
                        { target: "invalid" },
                    ],
                    COPY: { target: "copied", cond: "hasResults" },
                },
            },
            // changed: {
            // 	entry: "handleChange",
            // 	on: {
            // 		CHANGE: "changed",
            // 		SHORTEN: [
            // 			{ target: "shortening", cond: "validURL" },
            // 			{ target: "invalid" },
            // 		],
            // 		COPY: { target: "copied", cond: "hasResults" },
            // 	},
            // },
            shortening: {
                entry: "handleSubmit",
                on: {
                    SUCCESS: "shortened",
                    FAIL: "failed",
                },
            },
            invalid: {
                entry: "handleInvalid",
                // @ts-ignore
                always: "idle",
            },
            shortened: {
                entry: "handleShortened",
                // @ts-ignore
                always: "idle",
            },
            failed: {
                entry: "handleFail",
                // @ts-ignore
                always: "idle",
            },
            copied: {
                entry: "handleCopy",
                // @ts-ignore
                always: "idle",
            },
        },
    };

    class NavigationController extends Controller {
        toggle(e) {
            const button = e.target;
            const hiddenClass = this.data.get("hiddenClass");
            const ariaExpanded = button.getAttribute("aria-expanded") !== "false";
            this.navTarget.classList.toggle(hiddenClass, !ariaExpanded);
            button.setAttribute("aria-expanded", "" + !ariaExpanded);
        }
    }
    NavigationController.targets = ["nav"];
    class FormFieldController extends Controller {
        connect() {
            // Programmatically changing input.value doesn't trigger event listeners.
            // This is a workaround. See https://stackoverflow.com/a/55033939/12695621
            const valueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
            const toggleLabel = this.toggleLabel.bind(this);
            Object.defineProperty(this.inputTarget, "value", Object.assign(Object.assign({}, valueDesc), { set(v) {
                    valueDesc.set.call(this, v);
                    toggleLabel();
                } }));
        }
        /**
         * Simulate the <input> placeholder attribute behaviour;
         * show the label when input is empty, hide otherwise.
         */
        toggleLabel() {
            const labelHiddenClass = this.data.get("labelHiddenClass");
            this.labelTarget.classList.toggle(labelHiddenClass, !!this.inputTarget.value);
        }
    }
    FormFieldController.targets = ["label", "input"];
    class UrlShortenerController extends Controller {
        constructor() {
            super(...arguments);
            // handleChange = (ctx: URLShortenerContext, e: URLShortenerEvent) => {}
            this.handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const loadingClass = this.data.get("loadingClass");
                this.element.classList.add(loadingClass);
                this.setInputValidity(true);
                const url = this.inputTarget.value;
                try {
                    const response = yield fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`);
                    const data = yield response.json();
                    const result = {
                        ok: data.ok,
                        shortUrl: (_a = data.result) === null || _a === void 0 ? void 0 : _a.short_link,
                        fullShortUrl: (_b = data.result) === null || _b === void 0 ? void 0 : _b.full_short_link,
                        originalUrl: url,
                    };
                    this.service.send({ type: "SUCCESS", payload: result });
                }
                catch (_c) {
                    this.service.send("FAIL");
                }
            });
            this.handleInvalid = () => {
                this.setInputValidity(false);
            };
            this.handleShortened = (_, e) => {
                const loadingClass = this.data.get("loadingClass");
                this.element.classList.remove(loadingClass);
                if (e.type === "SUCCESS") {
                    const result = e.payload;
                    this.addResult(result);
                }
            };
            this.handleFail = () => {
                const failedClass = this.data.get("shortenFailedClass");
                this.element.classList.add(failedClass);
            };
            this.handleCopy = () => {
                // Continue from here
                navigator.clipboard.writeText(this.sourceTarget.href).then(() => this.element.classList.add(this.data.get("copiedClass")), () => this.element.classList.add(this.data.get("copyFailedText")));
            };
            this.isValidURL = () => {
                // Lazy way to do this, but works :)
                console.log(this.formTarget.checkValidity());
                return this.formTarget.checkValidity();
            };
            this.hasResults = () => {
                return this.results.length > 0;
            };
            /**
             * Prepend a shortened URL result to the results list, DOM list and storage list.
             * This function also trims the lists, so they are never longer 3 elements.
             */
            this.addResult = (result) => {
                if (this.results.length === 3) {
                    this.results.pop();
                    this.resultListTarget.lastElementChild.remove();
                }
                this.results.unshift(result);
                const resultLi = this.createResultLi(result);
                this.resultListTarget.insertBefore(resultLi, this.resultListTarget.firstElementChild);
                sessionStorage.setItem("shortenedURLResults", JSON.stringify(this.results));
            };
            /**
             * Create an <li> element containing a compiled result template.
             */
            this.createResultLi = (shortened) => {
                const resultHTML = this.resultTemplateTarget.innerHTML.replace(/{{ ([a-zA-Z]+) }}/g, (_, placeholder) => "" + shortened[placeholder]);
                const resultLi = document.createElement("li");
                resultLi.innerHTML = resultHTML;
                return resultLi;
            };
            this.setInputValidity = (valid) => {
                const { helperTextTarget, inputTarget, formTarget, data } = this;
                const errorClass = data.get("formErrorClass");
                if (valid) {
                    formTarget.classList.remove(errorClass);
                    inputTarget.setAttribute("aria-invalid", "false");
                    inputTarget.removeAttribute("aria-describedby");
                }
                else {
                    formTarget.classList.add(errorClass);
                    inputTarget.setAttribute("aria-invalid", "true");
                    inputTarget.setAttribute("aria-describedby", helperTextTarget.id);
                    inputTarget.focus();
                }
            };
        }
        initialize() {
            var _a;
            const resultsInStorage = sessionStorage.getItem("shortenedURLResults");
            this.results = (_a = JSON.parse(resultsInStorage)) !== null && _a !== void 0 ? _a : [];
            const { 
            // handleChange,
            handleSubmit, handleInvalid, handleShortened, handleFail, handleCopy, isValidURL, hasResults, } = this;
            const urlShortenerMachine = createMachine(urlShortenerMachineConfig, {
                actions: {
                    // handleChange,
                    handleSubmit,
                    handleInvalid,
                    handleShortened,
                    handleFail,
                    handleCopy,
                },
                guards: {
                    isValidURL,
                    hasResults,
                },
            });
            this.service = interpret(urlShortenerMachine);
            this.service.subscribe((state) => {
                console.log(state.value);
            });
        }
        connect() {
            this.formTarget.noValidate = true;
            this.results.forEach((result) => {
                this.resultListTarget.appendChild(this.createResultLi(result));
            });
            this.service.start();
        }
        disconnect() {
            this.service.stop();
        }
        submit(e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                this.service.send("SHORTEN");
                /*
        
                const {
                    formTarget,
                    inputTarget,
                    addResult,
                    shorten,
                    setInputValidity,
                } = this
        
                const failedClass = this.data.get("shortenFailedClass")
                this.element.classList.remove(failedClass) // if necessary
        
                if (formTarget.checkValidity()) {
                    setInputValidity(true)
        
                    const loadingClass = this.data.get("loadingClass")
                    this.element.classList.add(loadingClass)
        
                    const shortened: ShortenedURLResult = await shorten(inputTarget.value)
                    this.element.classList.remove(loadingClass)
        
                    if (shortened.ok) {
                        addResult(shortened)
                        inputTarget.value = ""
                    } else {
                        this.element.classList.add(failedClass)
                    }
                } else {
                    setInputValidity(false)
                }
                */
            });
        }
        shorten(url) {
            return fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`)
                .then((response) => response.json())
                .then((data) => {
                var _a, _b;
                return ({
                    ok: data.ok,
                    shortUrl: (_a = data.result) === null || _a === void 0 ? void 0 : _a.short_link,
                    fullShortUrl: (_b = data.result) === null || _b === void 0 ? void 0 : _b.full_short_link,
                    originalUrl: url,
                });
            }, () => ({ ok: false }));
        }
    }
    UrlShortenerController.targets = [
        "form",
        "input",
        "helperText",
        "resultTemplate",
        "resultList",
        "source",
    ];
    class ClipboardController extends Controller {
        copy(e) {
            navigator.clipboard.writeText(this.sourceTarget.href).then(() => this.element.classList.add(this.data.get("copiedClass")), () => this.element.classList.add(this.data.get("copyFailedText")));
        }
    }
    ClipboardController.targets = ["source"];
    const application = Application.start();
    application.register("navigation", NavigationController);
    application.register("form-field", FormFieldController);
    application.register("url-shortener", UrlShortenerController);
    application.register("clipboard", ClipboardController);

}());
//# sourceMappingURL=bundle.js.map
